import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ObjectId, Types } from 'mongoose';

export interface CartItem {
  productId: Types.ObjectId;
  quantity: number;
  price?: number; // Store price at time of adding to cart
}

const CartItemSchema = {
  productId: { type: Types.ObjectId, required: true, ref: 'Product' },
  quantity: { type: Number, required: true, min: 1 },
  price: { type: Number, required: false },
};

@Schema({
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
})
export class Cart {
  readonly _id: ObjectId;

  @Prop({ required: true, type: Types.ObjectId, ref: 'User', unique: true })
  userId: Types.ObjectId;

  @Prop({ required: false, type: [CartItemSchema], default: [] })
  items: CartItem[];

  @Prop({ required: false, type: Number, default: 0 })
  total: number;

  @Prop({ required: false, type: Number, default: 0 })
  itemCount: number;
}

export const CartSchema = SchemaFactory.createForClass(Cart);
