import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
  discriminatorKey: 'role',
})
export class Seller {
  username: string;
  password: string;
  email: string;
  phone: string;
  address: string;
  @Prop({ required: true, default: undefined })
  bankAccountNumber: string;
}

export const SellerSchema = SchemaFactory.createForClass(Seller);
