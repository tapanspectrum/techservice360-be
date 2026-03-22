import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { UpdateTicketDto } from './dto/update-ticket.dto';
import { Ticket, TicketDocument } from './schemas/ticket.schema';
import { NotificationsService } from '../notifications/notifications.service';
import { NotificationStatus, NotificationType } from '../notifications/dto/create-notification.dto';

@Injectable()
export class TicketsService {
  constructor(
    @InjectModel(Ticket.name) private readonly ticketModel: Model<TicketDocument>,
    private readonly notificationsService: NotificationsService,
  ) {}

  async create(createTicketDto: CreateTicketDto) {
    const ticket = new this.ticketModel(createTicketDto);
    const savedTicket = await ticket.save();

    await this.notificationsService.create({
      type: NotificationType.EMAIL,
      recipient: 'system',
      message: `Ticket created: ${savedTicket.title}`,
      status: NotificationStatus.PENDING,
      clientId: savedTicket.clientId?.toString(),
      referenceId: (savedTicket as any)._id.toString(),
      template: 'ticket-create',
    });

    return savedTicket;
  }

  findAll() {
    return this.ticketModel
      .find()
      .populate({
        path: 'tenantId',
        select: '_id name email',
      })
      .populate({
        path: 'clientId',
        select: '_id name email',
      })
      .populate({
        path: 'assignedTo',
        select: '_id name email',
      })
      .exec();
  }

  findOne(id: string) {
    return this.ticketModel
      .findById(id)
      .populate({
        path: 'tenantId',
        select: '_id name email',
      })
      .populate({
        path: 'clientId',
        select: '_id name email',
      })
      .populate({
        path: 'assignedTo',
        select: '_id name email',
      })
      .exec();
  }

  update(id: string, updateTicketDto: UpdateTicketDto) {
    return this.ticketModel.findByIdAndUpdate(id, updateTicketDto, { new: true }).exec();
  }

  remove(id: string) {
    return this.ticketModel.findByIdAndDelete(id).exec();
  }
}
