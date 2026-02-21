import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { Project } from './schemas/project.schema';

@Injectable()
export class ProjectsService {
  constructor(@InjectModel(Project.name) private projectModel: Model<Project>) {}


  create(createProjectDto: CreateProjectDto) {
    if (!createProjectDto.tenantId) throw new Error('tenantId is required');
    const createdProject = new this.projectModel(createProjectDto);
    return createdProject.save();
  }


  findAll(tenantId: string) {
    return this.projectModel.find({ tenantId }).exec();
  }


  findOne(id: string, tenantId: string) {
    return this.projectModel.findOne({ _id: id, tenantId }).exec();
  }


  update(id: string, updateProjectDto: UpdateProjectDto, tenantId: string) {
    return this.projectModel.findOneAndUpdate({ _id: id, tenantId }, updateProjectDto, { new: true }).exec();
  }


  remove(id: string, tenantId: string) {
    return this.projectModel.findOneAndDelete({ _id: id, tenantId }).exec();
  }


  findByClient(clientId: string, tenantId: string) {
    return this.projectModel.find({ clientId, tenantId }).exec();
  }


  findByStatus(status: string, tenantId: string) {
    return this.projectModel.find({ status, tenantId }).exec();
  }

  findByManager(manager: string) {
    return this.projectModel.find({ manager }).exec();
  }
}
