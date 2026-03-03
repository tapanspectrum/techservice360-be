import { Injectable } from '@nestjs/common';
import { CreateMailDto } from './dto/create-mail.dto';
import { UpdateMailDto } from './dto/update-mail.dto';

@Injectable()
export class MailService {
  create(createMailDto: CreateMailDto) {
    return 'This action adds a new mail';
  }

  findAll() {
    return `This action returns all mail`;
  }

  findOne(id: number) {
    return `This action returns a #${id} mail`;
  }

  update(id: number, updateMailDto: UpdateMailDto) {
    return `This action updates a #${id} mail`;
  }

  remove(id: number) {
    return `This action removes a #${id} mail`;
  }

  sendEmail(adminEmail: string,
    userEmail: string,
    userName: string,
    message: string,
    adId: string) {
    const { sendContactForm } = require('../utils/services/email/email.service');
    return sendContactForm(adminEmail, userEmail, userName, message, adId);
  }
}
