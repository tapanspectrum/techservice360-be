import { Injectable, BadRequestException, ConflictException, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { UpdateTicketDto } from './dto/update-ticket.dto';
import { Ticket } from './schemas/ticket.schema';
import { TicketStatus } from './tickets.constants';
import { User } from '../user/schemas/user.schema';
import { sendEmail } from '../utils/services/email/email.service';
import config from '../utils/config/config';

@Injectable()
export class TicketsService {
  private readonly logger = new Logger(TicketsService.name);

  constructor(
    @InjectModel(Ticket.name) private readonly ticketModel: Model<Ticket>,
    @InjectModel(User.name) private readonly userModel: Model<User>
  ) {}

  get model() {
    return this.ticketModel;
  }

  private throwFriendlyConflictForDuplicateActiveTicket(error: unknown): never {
    const mongoError = error as { code?: number; keyPattern?: Record<string, unknown> };
    const isDuplicateKey = mongoError?.code === 11000;
    const isTechnicianConstraint = Boolean(mongoError?.keyPattern?.technician) && Boolean(mongoError?.keyPattern?.tenantId);

    if (isDuplicateKey && isTechnicianConstraint) {
      throw new ConflictException('Technician already has an active ticket. Complete it before assigning a new ticket.');
    }

    throw error;
  }

  private normalizeAppLink(appLink?: string) {
    const source = appLink || config.clientUrl;

    try {
      const normalized = /^https?:\/\//i.test(source) ? source : `http://${source}`;
      const parsed = new URL(normalized);
      return parsed.origin;
    } catch {
      return /^https?:\/\//i.test(config.clientUrl) ? config.clientUrl : `http://${config.clientUrl}`;
    }
  }

  private async sendTicketAssignmentEmail(ticket: { _id?: string; title?: string; description?: string; type?: string; priority?: string; status?: string; clientId?: string; tenantId?: string; technician?: string }, appLink?: string) {
    const technicianId = ticket.technician;
    if (!technicianId) {
      return;
    }

    try {
      const technician = await this.userModel.findById(technicianId).select('name email role').lean().exec();

      if (!technician?.email || technician.role !== 'tech') {
        return;
      }

      const resolvedAppLink = this.normalizeAppLink(appLink);
      const subject = `New Ticket Assigned: ${ticket.title ?? 'Untitled Ticket'}`;
      const text = `Hi ${technician.name ?? 'Technician'},

You have been assigned a new ticket.

Ticket Details:
- Ticket ID: ${ticket._id ?? 'N/A'}
- Title: ${ticket.title ?? 'N/A'}
- Description: ${ticket.description ?? 'N/A'}
- Type: ${ticket.type ?? 'N/A'}
- Priority: ${ticket.priority ?? 'N/A'}
- Status: ${ticket.status ?? 'N/A'}
- Client ID: ${ticket.clientId ?? 'N/A'}
- Tenant ID: ${ticket.tenantId ?? 'N/A'}

Please check your dashboard for further updates.

App Link: ${resolvedAppLink}`;

      const html = `<div style="margin:20px;padding:20px;border:1px solid #ddd;border-radius:8px;">
<p>Hi ${technician.name ?? 'Technician'},</p>
<p>You have been assigned a new ticket.</p>
<h4>Ticket Details</h4>
<ul>
  <li><strong>Ticket ID:</strong> ${ticket._id ?? 'N/A'}</li>
  <li><strong>Title:</strong> ${ticket.title ?? 'N/A'}</li>
  <li><strong>Description:</strong> ${ticket.description ?? 'N/A'}</li>
  <li><strong>Type:</strong> ${ticket.type ?? 'N/A'}</li>
  <li><strong>Priority:</strong> ${ticket.priority ?? 'N/A'}</li>
  <li><strong>Status:</strong> ${ticket.status ?? 'N/A'}</li>
  <li><strong>Client ID:</strong> ${ticket.clientId ?? 'N/A'}</li>
  <li><strong>Tenant ID:</strong> ${ticket.tenantId ?? 'N/A'}</li>
</ul>
<p>Please check your dashboard for further updates.</p>
<p><strong>App Link:</strong> <a href="${resolvedAppLink}" target="_blank" rel="noopener noreferrer">${resolvedAppLink}</a></p>
</div>`;

      await sendEmail(technician.email, subject, text, html);
    } catch (error) {
      this.logger.warn(`Unable to send assignment email for ticket ${ticket._id ?? 'unknown'}`);
    }
  }

  private async ensureTechnicianHasNoActiveTicket(technician: string, ticketStatus: string, tenantId?: string, userRole?: string, excludeTicketId?: string) {
    if (!technician || ticketStatus === TicketStatus.COMPLETED) {
      return;
    }

    const query: Record<string, unknown> = {
      technician,
      status: { $ne: TicketStatus.COMPLETED },
    };

    if (excludeTicketId) {
      query._id = { $ne: excludeTicketId };
    }

    if (userRole !== 'admin' && tenantId) {
      query.tenantId = tenantId;
    }

    const existingActiveTicket = await this.ticketModel.findOne(query).select('_id').lean().exec();

    if (existingActiveTicket) {
      throw new ConflictException('Technician already has an active ticket. Complete it before assigning a new ticket.');
    }
  }

  async create(createTicketDto: CreateTicketDto, userRole?: string, appLink?: string) {
    console.log('Creating ticket with data:', createTicketDto);
    console.log('User Role:', userRole);

    if (userRole === 'admin') {
      createTicketDto.tenantId = '';

      await this.ensureTechnicianHasNoActiveTicket(createTicketDto.technician, createTicketDto.status, createTicketDto.tenantId, userRole);

      const createdTicket = new this.ticketModel(createTicketDto);
      try {
        const savedTicket = await createdTicket.save();
        await this.sendTicketAssignmentEmail({
          _id: String(savedTicket._id),
          title: savedTicket.title,
          description: savedTicket.description,
          type: savedTicket.type,
          priority: savedTicket.priority,
          status: savedTicket.status,
          clientId: savedTicket.clientId,
          tenantId: savedTicket.tenantId,
          technician: String(savedTicket.technician),
        }, appLink);
        return savedTicket;
      } catch (error) {
        this.throwFriendlyConflictForDuplicateActiveTicket(error);
      }
    }

    if (userRole !== 'admin' && !createTicketDto.tenantId) throw new BadRequestException('tenantId is required');

    await this.ensureTechnicianHasNoActiveTicket(createTicketDto.technician, createTicketDto.status, createTicketDto.tenantId, userRole);

    const createdTicket = new this.ticketModel(createTicketDto);
    try {
      const savedTicket = await createdTicket.save();
      await this.sendTicketAssignmentEmail({
        _id: String(savedTicket._id),
        title: savedTicket.title,
        description: savedTicket.description,
        type: savedTicket.type,
        priority: savedTicket.priority,
        status: savedTicket.status,
        clientId: savedTicket.clientId,
        tenantId: savedTicket.tenantId,
        technician: String(savedTicket.technician),
      }, appLink);
      return savedTicket;
    } catch (error) {
      this.throwFriendlyConflictForDuplicateActiveTicket(error);
    }
  }

  private normalizeTechnician<T extends { technician?: unknown }>(ticket: T): T {
    if (ticket?.technician && typeof ticket.technician === 'object' && 'name' in (ticket.technician as Record<string, unknown>)) {
      const technician = ticket.technician as { name?: string; _id?: string };
      return {
        ...ticket,
        technician: {
          _id: technician._id,
          name: technician.name,
        },
      } as T;
    }

    return ticket;
  }

  async findAll(tenantId: string, userRole?: string) {
    const tickets = userRole === 'admin' ? await this.ticketModel.find().populate({ path: 'technician', select: 'name _id' }).lean().exec() : await this.ticketModel.find({ tenantId }).populate({ path: 'technician', select: 'name _id' }).lean().exec();

    return tickets.map((ticket) => this.normalizeTechnician(ticket));
  }

  async findOne(id: string, tenantId: string, userRole?: string) {
    const ticket = userRole === 'admin' ? await this.ticketModel.findOne({ _id: id }).populate({ path: 'technician', select: 'name _id' }).lean().exec() : await this.ticketModel.findOne({ _id: id, tenantId }).populate({ path: 'technician', select: 'name _id' }).lean().exec();

    if (!ticket) {
      return ticket;
    }

    return this.normalizeTechnician(ticket);
  }

  async update(id: string, updateTicketDto: UpdateTicketDto, tenantId: string, userRole?: string, appLink?: string) {
    const currentTicket = userRole === 'admin' ? await this.ticketModel.findOne({ _id: id }).lean().exec() : await this.ticketModel.findOne({ _id: id, tenantId }).lean().exec();

    if (!currentTicket) {
      return null;
    }

    const currentTechnician = String(currentTicket.technician);
    const nextTechnician = updateTicketDto.technician ?? currentTechnician;
    const nextStatus = updateTicketDto.status ?? currentTicket.status;
    const effectiveTenantId = userRole === 'admin' ? currentTicket.tenantId : tenantId;

    await this.ensureTechnicianHasNoActiveTicket(nextTechnician, nextStatus, effectiveTenantId, userRole, id);

    const isReassigned = Boolean(updateTicketDto.technician) && nextTechnician !== currentTechnician;

    if (userRole === 'admin') {
      try {
        const updatedTicket = await this.ticketModel.findOneAndUpdate({ _id: id }, updateTicketDto, { new: true }).exec();
        if (updatedTicket && isReassigned) {
          await this.sendTicketAssignmentEmail({
            _id: String(updatedTicket._id),
            title: updatedTicket.title,
            description: updatedTicket.description,
            type: updatedTicket.type,
            priority: updatedTicket.priority,
            status: updatedTicket.status,
            clientId: updatedTicket.clientId,
            tenantId: updatedTicket.tenantId,
            technician: String(updatedTicket.technician),
          }, appLink);
        }
        return updatedTicket;
      } catch (error) {
        this.throwFriendlyConflictForDuplicateActiveTicket(error);
      }
    }

    try {
      const updatedTicket = await this.ticketModel.findOneAndUpdate({ _id: id, tenantId }, updateTicketDto, { new: true }).exec();
      if (updatedTicket && isReassigned) {
        await this.sendTicketAssignmentEmail({
          _id: String(updatedTicket._id),
          title: updatedTicket.title,
          description: updatedTicket.description,
          type: updatedTicket.type,
          priority: updatedTicket.priority,
          status: updatedTicket.status,
          clientId: updatedTicket.clientId,
          tenantId: updatedTicket.tenantId,
          technician: String(updatedTicket.technician),
        }, appLink);
      }
      return updatedTicket;
    } catch (error) {
      this.throwFriendlyConflictForDuplicateActiveTicket(error);
    }
  }

  remove(id: string, tenantId: string, userRole?: string) {
    if (userRole === 'admin') {
      return this.ticketModel.findOneAndDelete({ _id: id }).exec();
    }
    return this.ticketModel.findOneAndDelete({ _id: id, tenantId }).exec();
  }

  async findByClient(clientId: string, tenantId: string, userRole?: string) {
    const tickets = userRole === 'admin' ? await this.ticketModel.find({ clientId }).populate({ path: 'technician', select: 'name _id' }).lean().exec() : await this.ticketModel.find({ clientId, tenantId }).populate({ path: 'technician', select: 'name _id' }).lean().exec();

    return tickets.map((ticket) => this.normalizeTechnician(ticket));
  }

  async findByStatus(status: string, tenantId: string, userRole?: string) {
    const tickets = userRole === 'admin' ? await this.ticketModel.find({ status }).populate({ path: 'technician', select: 'name _id' }).lean().exec() : await this.ticketModel.find({ status, tenantId }).populate({ path: 'technician', select: 'name _id' }).lean().exec();

    return tickets.map((ticket) => this.normalizeTechnician(ticket));
  }
}
