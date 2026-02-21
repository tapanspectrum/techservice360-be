import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { UpdateTicketDto } from './dto/update-ticket.dto';
import { Ticket } from './schemas/ticket.schema';

@Injectable()
export class TicketsService {
  constructor(@InjectModel(Ticket.name) private readonly ticketModel: Model<Ticket>) {}

  get model() {
    return this.ticketModel;
  }


  create(createTicketDto: CreateTicketDto, userRole?: string) {
    if (userRole !== 'admin' && !createTicketDto.tenantId) throw new Error('tenantId is required');
    const createdTicket = new this.ticketModel(createTicketDto);
    return createdTicket.save();
  }


  findAll(tenantId: string, userRole?: string) {
    if (userRole === 'admin') {
      return this.ticketModel.find().exec();
    }
    return this.ticketModel.find({ tenantId }).exec();
  }


  findOne(id: string, tenantId: string, userRole?: string) {
    if (userRole === 'admin') {
      return this.ticketModel.findOne({ _id: id }).exec();
    }
    return this.ticketModel.findOne({ _id: id, tenantId }).exec();
  }


  update(id: string, updateTicketDto: UpdateTicketDto, tenantId: string, userRole?: string) {
    if (userRole === 'admin') {
      return this.ticketModel.findOneAndUpdate({ _id: id }, updateTicketDto, { new: true }).exec();
    }
    return this.ticketModel.findOneAndUpdate({ _id: id, tenantId }, updateTicketDto, { new: true }).exec();
  }


  remove(id: string, tenantId: string, userRole?: string) {
    if (userRole === 'admin') {
      return this.ticketModel.findOneAndDelete({ _id: id }).exec();
    }
    return this.ticketModel.findOneAndDelete({ _id: id, tenantId }).exec();
  }


  findByClient(clientId: string, tenantId: string, userRole?: string) {
    if (userRole === 'admin') {
      return this.ticketModel.find({ clientId }).exec();
    }
    return this.ticketModel.find({ clientId, tenantId }).exec();
  }


  findByStatus(status: string, tenantId: string, userRole?: string) {
    if (userRole === 'admin') {
      return this.ticketModel.find({ status }).exec();
    }
    return this.ticketModel.find({ status, tenantId }).exec();
  }
}
