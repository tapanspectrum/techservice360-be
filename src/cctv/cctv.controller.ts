import { Controller, Get, Post, Body, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { TenantGuard } from '../auth/tenant.guard';
import { CctvService } from './cctv.service';

@UseGuards(AuthGuard('jwt'), TenantGuard)
@Controller('cctv')
export class CctvController {
  constructor(private readonly cctvService: CctvService) {}

  @Get()
  findAll(@Req() req) {
    const userRole = req.user?.role;
    const tenantId = userRole !== 'admin' ? req.tenantId : null;
    return this.cctvService.findAll(tenantId, userRole);
  }

  @Post()
  create(@Body() createCctvDto, @Req() req) {
    const userRole = req.user?.role;
    if (userRole !== 'admin') {
      createCctvDto.tenantId = req.tenantId;
    }
    return this.cctvService.create(createCctvDto, userRole);
  }
}
