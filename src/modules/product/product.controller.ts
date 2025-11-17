import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { AuthGuard, RolesGuard } from '@common/guards';
import { ROLE_ENUM } from 'src/types/enums';
import { Roles, Public, User } from 'src/decorators';

@Controller('product')
@UseGuards(AuthGuard, RolesGuard)
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post()
  @Roles(ROLE_ENUM.ADMIN, ROLE_ENUM.SELLER)
  create(@Body() createProductDto: CreateProductDto, @User() user: any) {
    const sellerId = (user?._id || user?.id)?.toString();
    if (!sellerId) {
      throw new Error('User ID not found');
    }
    return this.productService.create(createProductDto, sellerId);
  }

  @Public() // make this route public
  @Get()
  findAll() {
    return this.productService.findAll();
  }

  @Public() // make this route public
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productService.findOne(id);
  }

  @Patch(':id')
  @Roles(ROLE_ENUM.ADMIN, ROLE_ENUM.SELLER)
  update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto) {
    return this.productService.update(id, updateProductDto);
  }

  @Delete(':id')
  @Roles(ROLE_ENUM.ADMIN, ROLE_ENUM.SELLER)
  remove(@Param('id') id: string) {
    return this.productService.remove(id);
  }
}
