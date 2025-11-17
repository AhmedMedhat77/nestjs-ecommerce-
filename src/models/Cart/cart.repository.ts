import { Model, UpdateQuery } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { AbstractRepository } from '../abstract.repository';
import { Cart } from './cart.schema';
import { Types } from 'mongoose';

@Injectable()
export class CartRepository extends AbstractRepository<Cart> {
  constructor(@InjectModel(Cart.name) cartModel: Model<Cart>) {
    super(cartModel);
  }

  async createCart(cartData: Partial<Cart>) {
    return await this.create(cartData);
  }

  async findCartByUser(userId: string) {
    return await this.findOne({
      userId: new Types.ObjectId(userId),
    });
  }

  async findCartByUserWithPopulate(userId: string) {
    return await this.model
      .findOne({ userId: new Types.ObjectId(userId) })
      .populate('items.productId')
      .exec();
  }

  async updateCart(userId: string, updateData: UpdateQuery<Partial<Cart>>) {
    return await this.findOneAndUpdate(
      { userId: new Types.ObjectId(userId) },
      updateData,
      { new: true, upsert: true },
    );
  }

  async clearCart(userId: string) {
    return await this.findOneAndUpdate(
      { userId: new Types.ObjectId(userId) },
      {
        $set: {
          items: [],
          total: 0,
          itemCount: 0,
        },
      },
      { new: true },
    );
  }
}
