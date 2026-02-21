import { Controller, Get, Post, Body, Patch, Param, Delete, Req, UseGuards } from '@nestjs/common';
import { TenantGuard } from '../auth/tenant.guard';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@UseGuards(TenantGuard)
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}


  @Post()
  create(@Body() createUserDto: CreateUserDto, @Req() req) {
    const userRole = req.user?.role;
    if (userRole !== 'admin') {
      createUserDto.tenantId = req.tenantId;
    }
    return this.userService.create(createUserDto, userRole);
  }


  @Get()
  findAll(@Req() req) {
    const userRole = req.user?.role;
    return this.userService.findAll(req.tenantId, userRole);
  }


  @Get(':id')
  findOne(@Param('id') id: string, @Req() req) {
    const userRole = req.user?.role;
    return this.userService.findOne(id, req.tenantId, userRole);
  }


  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto, @Req() req) {
    const userRole = req.user?.role;
    return this.userService.update(id, updateUserDto, req.tenantId, userRole);
  }


  @Delete(':id')
  remove(@Param('id') id: string, @Req() req) {
    const userRole = req.user?.role;
    return this.userService.remove(id, req.tenantId, userRole);
  }
}
