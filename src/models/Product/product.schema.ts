import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ObjectId, Types } from 'mongoose';

@Schema({
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
})
export class Product {
  readonly _id: ObjectId;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true, type: Number, min: 0 })
  price: number;

  @Prop({ required: false, type: Number, min: 0, default: 0 })
  discountPrice?: number;

  @Prop({ required: true, type: Number, min: 0, default: 0 })
  stock: number;

  @Prop({ required: false, type: [String], default: [] })
  images: string[];

  @Prop({ required: false, type: Types.ObjectId, ref: 'Category' })
  categoryId?: Types.ObjectId;

  @Prop({ required: false, type: Types.ObjectId, ref: 'Brand' })
  brandId?: Types.ObjectId;

  @Prop({ required: false, type: [String], default: [] })
  tags: string[];

  @Prop({ required: true, type: Types.ObjectId, ref: 'User' })
  sellerId: Types.ObjectId;

  @Prop({ required: false, type: Boolean, default: true })
  isActive: boolean;

  @Prop({ required: false, type: Number, min: 0, max: 5, default: 0 })
  rating: number;

  @Prop({ required: false, type: Number, default: 0 })
  reviewCount: number;

  @Prop({ required: false, type: String })
  sku?: string;

  @Prop({ required: false, type: Object })
  specifications?: Record<string, any>;

  @Prop({ required: false, type: Number, default: 0 })
  soldCount: number;
}

export const ProductSchema = SchemaFactory.createForClass(Product);
