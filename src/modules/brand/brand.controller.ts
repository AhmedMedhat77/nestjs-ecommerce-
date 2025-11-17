import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
} from '@nestjs/common';
import { BrandService } from './brand.service';
import { CreateBrandDto } from './dto/create-brand.dto';
import { UpdateBrandDto } from './dto/update-brand.dto';
import { AuthGuard, RolesGuard } from '@common/guards';
import { Roles } from 'src/decorators';
import { ROLE_ENUM } from 'src/types/enums';

@Controller('brand')
@UseGuards(AuthGuard, RolesGuard)
export class BrandController {
  constructor(private readonly brandService: BrandService) {}

  @Post()
  @Roles(ROLE_ENUM.ADMIN, ROLE_ENUM.SELLER)
  create(@Body() createBrandDto: CreateBrandDto) {
    return this.brandService.create(createBrandDto);
  }

  @Get()
  findAll(@Query('active') active?: string) {
    if (active === 'true') {
      return this.brandService.findActive();
    }
    return this.brandService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.brandService.findOne(id);
  }

  @Patch(':id')
  @Roles(ROLE_ENUM.ADMIN, ROLE_ENUM.SELLER)
  update(@Param('id') id: string, @Body() updateBrandDto: UpdateBrandDto) {
    return this.brandService.update(id, updateBrandDto);
  }

  @Delete(':id')
  @Roles(ROLE_ENUM.ADMIN)
  remove(@Param('id') id: string) {
    return this.brandService.remove(id);
  }
}
