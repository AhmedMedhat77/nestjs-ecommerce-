import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ObjectId } from 'mongoose';

@Schema({
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
})
export class Brand {
  readonly _id: ObjectId;

  @Prop({ required: true, unique: true })
  name: string;

  @Prop({ required: false })
  description?: string;

  @Prop({ required: false, type: String })
  logo?: string;

  @Prop({ required: false, type: String })
  website?: string;

  @Prop({ required: false, type: Boolean, default: true })
  isActive: boolean;
}

export const BrandSchema = SchemaFactory.createForClass(Brand);

