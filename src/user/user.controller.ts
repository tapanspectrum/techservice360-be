import { Controller, Get, Post, Body, Patch, Param, Delete, Query, Req } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { UpdateUserAdminDto } from './dto/update-user-admin.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Roles } from '../auth/dto/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Get()
  @UseGuards(AuthGuard('jwt'))
  findAll(@Req() req) {
    console.log('Fetching all users', req?.user?._id);
    return this.userService.findAll(req?.user?._id ?? '');
  }

  @Get('available-techs')
  getAvailableTechs(@Query('search') search?: string) {
    return this.userService.getAvailableTechs(search);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userService.findOne(id);
  }

  @Patch(':id/profile')
  updateProfile(@Param('id') id: string, @Body() updateProfileDto: UpdateProfileDto) {
    return this.userService.updateProfile(id, updateProfileDto);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(id, updateUserDto);
  }

  @Patch(':id/admin')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('admin')
  updateAdmin(@Param('id') id: string, @Body() updateUserAdminDto: UpdateUserAdminDto) {
    return this.userService.updateAdmin(id, updateUserAdminDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.remove(id);
  }
}
