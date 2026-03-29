import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AmcService } from './amc.service';
import { CreateAmcProductDto } from './dto/create-amc-product.dto';
import { UpdateAmcProductDto } from './dto/update-amc-product.dto';

@ApiTags('AMC')
@Controller('amc')
export class AmcController {
  constructor(private readonly amcService: AmcService) {}

  @Post()
  @ApiOperation({ summary: 'Create AMC product (default 5%)' })
  @ApiResponse({ status: 201, description: 'AMC product created successfully' })
  create(@Body() createAmcProductDto: CreateAmcProductDto) {
    return this.amcService.create(createAmcProductDto);
  }

  @Get()
  @ApiOperation({ summary: 'List AMC products' })
  @ApiResponse({ status: 200, description: 'AMC products fetched successfully' })
  findAll() {
    return this.amcService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get AMC product by id' })
  @ApiResponse({ status: 200, description: 'AMC product fetched successfully' })
  @ApiResponse({ status: 404, description: 'AMC product not found' })
  findOne(@Param('id') id: string) {
    return this.amcService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update AMC product by id' })
  @ApiResponse({ status: 200, description: 'AMC product updated successfully' })
  @ApiResponse({ status: 404, description: 'AMC product not found' })
  update(
    @Param('id') id: string,
    @Body() updateAmcProductDto: UpdateAmcProductDto,
  ) {
    return this.amcService.update(id, updateAmcProductDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete AMC product by id' })
  @ApiResponse({ status: 200, description: 'AMC product deleted successfully' })
  @ApiResponse({ status: 404, description: 'AMC product not found' })
  remove(@Param('id') id: string) {
    return this.amcService.remove(id);
  }
}
