import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ObjectId } from 'mongoose';
import { ROLE_ENUM } from 'src/types';

@Schema({
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
  // the user role
  discriminatorKey: 'role',
})
export class User {
  // add user id as readonly
  readonly _id: ObjectId;
  @Prop({ required: true, unique: true, lowercase: true })
  email: string;
  @Prop({ required: true })
  password: string;
  @Prop({ required: true })
  fullname: string;
  @Prop({ required: false, default: '' })
  phone: string;
  @Prop({ required: false, default: '' })
  address: string;
  @Prop({ required: true, enum: ROLE_ENUM, default: ROLE_ENUM.USER })
  role: ROLE_ENUM;
  @Prop({ required: false, default: undefined })
  otp?: string;
  @Prop({ required: false, default: undefined })
  otpExpiry?: Date;
  @Prop({ required: false, default: undefined })
  credentialsUpdatedAt?: Date;
  @Prop({ required: true, default: false })
  isVerified: boolean;
  @Prop({ required: false, default: false })
  isEmailVerified: boolean;
  @Prop({ required: false, default: false })
  isPhoneVerified: boolean;
  @Prop({ required: false, default: false })
  isAddressVerified: boolean;
  @Prop({ required: false, default: undefined })
  avatar: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
