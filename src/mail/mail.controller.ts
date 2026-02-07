import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from "@nestjs/common";
import { MailService } from "./mail.service";
import { CreateMailDto } from "./dto/create-mail.dto";
import { UpdateMailDto } from "./dto/update-mail.dto";

@Controller("mail")
export class MailController {
  constructor(private readonly mailService: MailService) { }

  // @Post()
  // create(@Body() createMailDto: CreateMailDto) {
  //   return this.mailService.create(createMailDto);
  // }

  // @Get()
  // findAll() {
  //   return this.mailService.findAll();
  // }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.mailService.findOne(+id);
  // }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateMailDto: UpdateMailDto) {
  //   return this.mailService.update(+id, updateMailDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.mailService.remove(+id);
  // }

  @Post("send")
  sendEmail(
    @Body("name") name: string,
    @Body("email") email: string,
    @Body("message") message: string,
    @Body("adId") adId: string
  ) {
    return this.mailService.sendEmail('tapanspectrum@gmail.com', email, name, message, adId);
  }
}
