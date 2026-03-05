import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CctvService } from './cctv.service';
import { CreateCctvDto } from './dto/create-cctv.dto';
import { UpdateCctvDto } from './dto/update-cctv.dto';

@ApiTags('CCTV')
@Controller('cctv')
export class CctvController {
  constructor(private readonly cctvService: CctvService) {}

  @Post()
  @ApiOperation({ summary: 'Create CCTV record' })
  @ApiResponse({ status: 201, description: 'CCTV created successfully' })
  create(@Body() createCctvDto: CreateCctvDto) {
    return this.cctvService.create(createCctvDto);
  }

  @Get()
  @ApiOperation({ summary: 'List CCTV records' })
  @ApiResponse({ status: 200, description: 'CCTV records fetched successfully' })
  findAll() {
    return this.cctvService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get CCTV record by id' })
  @ApiResponse({ status: 200, description: 'CCTV record fetched successfully' })
  findOne(@Param('id') id: string) {
    return this.cctvService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update CCTV record by id' })
  @ApiResponse({ status: 200, description: 'CCTV record updated successfully' })
  update(@Param('id') id: string, @Body() updateCctvDto: UpdateCctvDto) {
    return this.cctvService.update(id, updateCctvDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete CCTV record by id' })
  @ApiResponse({ status: 200, description: 'CCTV record deleted successfully' })
  remove(@Param('id') id: string) {
    return this.cctvService.remove(id);
  }
}
