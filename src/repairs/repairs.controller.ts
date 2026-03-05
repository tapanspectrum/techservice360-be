import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateRepairDto } from './dto/create-repair.dto';
import { UpdateRepairDto } from './dto/update-repair.dto';
import { RepairsService } from './repairs.service';

@ApiTags('Repairs')
@Controller('repairs')
export class RepairsController {
  constructor(private readonly repairsService: RepairsService) {}

  @Post()
  @ApiOperation({ summary: 'Create repair request' })
  @ApiResponse({ status: 201, description: 'Repair created successfully' })
  create(@Body() createRepairDto: CreateRepairDto) {
    return this.repairsService.create(createRepairDto);
  }

  @Get()
  @ApiOperation({ summary: 'List repair requests' })
  @ApiResponse({ status: 200, description: 'Repairs fetched successfully' })
  findAll() {
    return this.repairsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get repair request by id' })
  @ApiResponse({ status: 200, description: 'Repair fetched successfully' })
  findOne(@Param('id') id: string) {
    return this.repairsService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update repair request by id' })
  @ApiResponse({ status: 200, description: 'Repair updated successfully' })
  update(@Param('id') id: string, @Body() updateRepairDto: UpdateRepairDto) {
    return this.repairsService.update(id, updateRepairDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete repair request by id' })
  @ApiResponse({ status: 200, description: 'Repair deleted successfully' })
  remove(@Param('id') id: string) {
    return this.repairsService.remove(id);
  }
}
