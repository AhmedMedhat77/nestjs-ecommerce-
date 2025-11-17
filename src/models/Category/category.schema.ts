import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ObjectId, Types } from 'mongoose';

@Schema({
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
})
export class Category {
  readonly _id: ObjectId;

  @Prop({ required: true, unique: true })
  name: string;

  @Prop({ required: false })
  description?: string;

  @Prop({ required: false, type: String })
  image?: string;

  @Prop({ required: false, type: String })
  slug?: string;

  @Prop({
    required: false,
    type: Types.ObjectId,
    ref: 'Category',
    default: null,
  })
  parentId?: Types.ObjectId;

  @Prop({ required: false, type: Boolean, default: true })
  isActive: boolean;

  @Prop({ required: false, type: Number, default: 0 })
  order: number;
}

export const CategorySchema = SchemaFactory.createForClass(Category);
