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
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { AuthGuard, RolesGuard } from '@common/guards';
import { Roles, User } from 'src/decorators';
import { ROLE_ENUM } from 'src/types/enums';
import { IUser } from 'src/types/interface';

@Controller('category')
@UseGuards(AuthGuard, RolesGuard)
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Post()
  @Roles(ROLE_ENUM.ADMIN, ROLE_ENUM.SELLER)
  create(@Body() createCategoryDto: CreateCategoryDto) {
    return this.categoryService.create(createCategoryDto);
  }

  @Get()
  findAll(@Query('active') active?: string) {
    if (active === 'true') {
      return this.categoryService.findActive();
    }
    return this.categoryService.findAll();
  }

  @Get('root')
  findRootCategories() {
    return this.categoryService.findRootCategories();
  }

  @Get('parent/:parentId')
  findByParent(@Param('parentId') parentId: string) {
    const id = parentId === 'null' ? null : parentId;
    return this.categoryService.findByParent(id);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.categoryService.findOne(id);
  }

  @Patch(':id')
  @Roles(ROLE_ENUM.ADMIN, ROLE_ENUM.SELLER)
  update(
    @Param('id') id: string,
    @Body() updateCategoryDto: UpdateCategoryDto,
    @User() user: Partial<IUser>,
  ) {
    return this.categoryService.update(id, updateCategoryDto, user);
  }

  @Delete(':id')
  @Roles(ROLE_ENUM.ADMIN)
  remove(@Param('id') id: string) {
    return this.categoryService.remove(id);
  }
}
