import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { CategoryRepository } from '@models/Category/category.repository';
import { Category } from '@models/Category/category.schema';
import { Types } from 'mongoose';
import { IUser } from 'src/types/interface';

@Injectable()
export class CategoryService {
  constructor(private readonly categoryRepository: CategoryRepository) {}

  async create(createCategoryDto: CreateCategoryDto) {
    // Check if category with same name already exists
    const existingCategory = await this.categoryRepository.findOne({
      name: createCategoryDto.name,
    });

    if (existingCategory) {
      throw new ConflictException('Category with this name already exists');
    }

    // If parentId is provided, verify it exists
    if (createCategoryDto.parentId) {
      const parent = await this.categoryRepository.findOne({
        _id: new Types.ObjectId(createCategoryDto.parentId),
      });
      if (!parent) {
        throw new NotFoundException('Parent category not found');
      }
    }

    const categoryData: Partial<Category> = {
      ...createCategoryDto,
      parentId: createCategoryDto.parentId
        ? new Types.ObjectId(createCategoryDto.parentId)
        : undefined,
    };

    return await this.categoryRepository.createCategory(categoryData);
  }

  async findAll() {
    return await this.categoryRepository.findAll({});
  }

  async findActive() {
    return await this.categoryRepository.findActiveCategories();
  }

  async findRootCategories() {
    return await this.categoryRepository.findRootCategories();
  }

  async findOne(id: string) {
    const category = await this.categoryRepository.findOne({
      _id: new Types.ObjectId(id),
    });

    if (!category) {
      throw new NotFoundException(`Category with ID ${id} not found`);
    }

    return category;
  }

  async findByParent(parentId: string | null) {
    return await this.categoryRepository.findCategoriesByParent(parentId);
  }

  async update(
    id: string,
    updateCategoryDto: UpdateCategoryDto,
    user: Partial<IUser>,
  ) {
    const category = await this.categoryRepository.findOne({
      _id: new Types.ObjectId(id),
    });

    if (!category) {
      throw new NotFoundException(`Category with ID ${id} not found`);
    }

    // If name is being updated, check for conflicts
    if (updateCategoryDto.name && updateCategoryDto.name !== category.name) {
      const existingCategory = await this.categoryRepository.findOne({
        name: updateCategoryDto.name,
      });
      if (existingCategory) {
        throw new ConflictException('Category with this name already exists');
      }
    }

    // If parentId is being updated, verify it exists and is not the same as id
    if (updateCategoryDto.parentId) {
      if (updateCategoryDto.parentId === id) {
        throw new ConflictException('Category cannot be its own parent');
      }
      const parent = await this.categoryRepository.findOne({
        _id: new Types.ObjectId(updateCategoryDto.parentId),
      });
      if (!parent) {
        throw new NotFoundException('Parent category not found');
      }
    }

    const updateData: Partial<Category> = {
      ...updateCategoryDto,
      parentId: updateCategoryDto.parentId
        ? new Types.ObjectId(updateCategoryDto.parentId)
        : undefined,
    };

    return await this.categoryRepository.findOneAndUpdate(
      { _id: new Types.ObjectId(id) },
      { $set: updateData },
      { new: true },
    );
  }

  async remove(id: string) {
    const category = await this.categoryRepository.findOne({
      _id: new Types.ObjectId(id),
    });

    if (!category) {
      throw new NotFoundException(`Category with ID ${id} not found`);
    }

    // Check if category has children
    const children = await this.categoryRepository.findAll({
      parentId: new Types.ObjectId(id),
    });

    if (children && children.length > 0) {
      throw new ConflictException(
        'Cannot delete category with subcategories. Please delete or reassign subcategories first.',
      );
    }

    return await this.categoryRepository.deleteById(id);
  }
}
