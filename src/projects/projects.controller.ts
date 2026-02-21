import { Controller, Get, Post, Body, Patch, Param, Delete, Query, Req, UseGuards } from '@nestjs/common';
import { TenantGuard } from '../auth/tenant.guard';
import { ProjectsService } from './projects.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';

@UseGuards(TenantGuard)
@Controller('projects')
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}


  @Post()
  create(@Body() createProjectDto: CreateProjectDto, @Req() req) {
    createProjectDto.tenantId = req.tenantId;
    return this.projectsService.create(createProjectDto);
  }


  @Get()
  findAll(@Query('status') status: string, @Req() req) {
    if (status) {
      return this.projectsService.findByStatus(status, req.tenantId);
    }
    return this.projectsService.findAll(req.tenantId);
  }


  @Get(':id')
  findOne(@Param('id') id: string, @Req() req) {
    return this.projectsService.findOne(id, req.tenantId);
  }


  @Patch(':id')
  update(@Param('id') id: string, @Body() updateProjectDto: UpdateProjectDto, @Req() req) {
    return this.projectsService.update(id, updateProjectDto, req.tenantId);
  }


  @Delete(':id')
  remove(@Param('id') id: string, @Req() req) {
    return this.projectsService.remove(id, req.tenantId);
  }


  @Get('client/:clientId')
  findByClient(@Param('clientId') clientId: string, @Req() req) {
    return this.projectsService.findByClient(clientId, req.tenantId);
  }
}
