import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { AbstractRepository } from '../abstract.repository';
import { Product } from './product.schema';

@Injectable()
export class ProductRepository extends AbstractRepository<Product> {
  constructor(@InjectModel(Product.name) productModel: Model<Product>) {
    super(productModel);
  }

  async createProduct(productData: Partial<Product>) {
    return await this.create(productData);
  }

  async findProductsBySeller(sellerId: string) {
    return await this.findAll({ sellerId, isActive: true });
  }

  async findActiveProducts(filter: any = {}) {
    return await this.findAll({ ...filter, isActive: true });
  }

  async updateProductStock(productId: string, quantity: number) {
    return await this.findOneAndUpdate(
      { _id: productId },
      { $inc: { stock: -quantity, soldCount: quantity } },
      { new: true },
    );
  }
}

