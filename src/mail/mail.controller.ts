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
  // create(@Body() createMailDto: CreateMailDto, @Req() req) {
  //   const userRole = req.user?.role;
  //   if (userRole !== 'admin') {
  //     createMailDto.tenantId = req.tenantId;
  //   }
  //   return this.mailService.create(createMailDto, userRole);
  // }

  // @Get()
  // findAll(@Req() req) {
  //   const userRole = req.user?.role;
  //   return this.mailService.findAll(req.tenantId, userRole);
  // }

  // @Get(':id')
  // findOne(@Param('id') id: string, @Req() req) {
  //   const userRole = req.user?.role;
  //   return this.mailService.findOne(id, req.tenantId, userRole);
  // }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateMailDto: UpdateMailDto, @Req() req) {
  //   const userRole = req.user?.role;
  //   return this.mailService.update(id, updateMailDto, req.tenantId, userRole);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string, @Req() req) {
  //   const userRole = req.user?.role;
  //   return this.mailService.remove(id, req.tenantId, userRole);
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
