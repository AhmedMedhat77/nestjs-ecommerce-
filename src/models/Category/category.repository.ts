import { Model, Types } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { AbstractRepository } from '../abstract.repository';
import { Category } from './category.schema';

@Injectable()
export class CategoryRepository extends AbstractRepository<Category> {
  constructor(@InjectModel(Category.name) categoryModel: Model<Category>) {
    super(categoryModel);
  }

  async createCategory(categoryData: Partial<Category>) {
    return await this.create(categoryData);
  }

  async findActiveCategories() {
    return await this.findAll({ isActive: true });
  }

  async findCategoriesByParent(parentId: string | null) {
    if (parentId === null) {
      return await this.findAll({ parentId: null });
    }
    return await this.findAll({
      parentId: new Types.ObjectId(parentId),
    });
  }

  async findRootCategories() {
    return await this.findAll({ parentId: null, isActive: true });
  }
}
