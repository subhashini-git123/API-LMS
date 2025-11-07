import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserDocument = User & Document;

// ✅ Define role enum
export enum Role {
  Admin = 'admin',
  Trainee = 'trainee',
  Manager = 'manager',
}

@Schema({ timestamps: true })
export class User {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  password: string;

  // ✅ Attach role enum to user schema
  @Prop({ type: String, enum: Role, default: Role.Manager })
  role: Role;
}

export const UserSchema = SchemaFactory.createForClass(User);