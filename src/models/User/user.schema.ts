import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { IUser, ROLE_ENUM } from 'src/types';

@Schema({
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
  // the user role
  discriminatorKey: 'role',
})
export class User implements IUser {
  @Prop({ required: true, unique: true, lowercase: true })
  email: string;
  @Prop({ required: true })
  password: string;
  @Prop({ required: true })
  fullname: string;
  @Prop({ required: true })
  phone: string;
  @Prop({ required: true })
  address: string;
  @Prop({ required: true, enum: ROLE_ENUM, default: ROLE_ENUM.USER })
  role: ROLE_ENUM;
  @Prop({ required: false, default: undefined })
  otp?: string;
  @Prop({ required: false, default: undefined })
  otpExpiry?: Date | undefined;
  @Prop({ required: false, default: undefined })
  credentialsUpdatedAt?: Date | undefined;
  @Prop({ required: true, default: false })
  isVerified: boolean;
}

export const UserSchema = SchemaFactory.createForClass(User);
