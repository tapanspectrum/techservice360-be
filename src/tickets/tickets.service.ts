import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { UpdateTicketDto } from './dto/update-ticket.dto';
import { Ticket, TicketDocument } from './schemas/ticket.schema';

@Injectable()
export class TicketsService {
  constructor(
    @InjectModel(Ticket.name) private readonly ticketModel: Model<TicketDocument>,
  ) {}

  create(createTicketDto: CreateTicketDto) {
    const ticket = new this.ticketModel(createTicketDto);
    return ticket.save();
  }

  findAll() {
    return this.ticketModel.find().exec();
  }

  findOne(id: string) {
    return this.ticketModel.findById(id).exec();
  }

  update(id: string, updateTicketDto: UpdateTicketDto) {
    return this.ticketModel
      .findByIdAndUpdate(id, updateTicketDto, { new: true })
      .exec();
  }

  remove(id: string) {
    return this.ticketModel.findByIdAndDelete(id).exec();
  }
}
