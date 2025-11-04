// import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
// import { Document } from 'mongoose';
// import * as bcrypt from 'bcrypt';

// export type UserDocument = User & Document;

// export enum Role {
// USER = 'user',
// MANAGER = 'manager',
// ADMIN = 'admin',
// }

// @Schema({ timestamps: true })
// export class User {
// @Prop({ required: true })
// name: string;

// @Prop({ required: true, unique: true })
// email: string;

// @Prop({ required: true })
// password: string;

// @Prop({ enum: Role, default: Role.USER })
// role: Role;

// // Optional: Hash password before saving
// async hashPassword(): Promise<void> {
// const salt = await bcrypt.genSalt();
// this.password = await bcrypt.hash(this.password, salt);
// }

// // Optional: Compare password for login
// async comparePassword(attempt: string): Promise<boolean> {
// return bcrypt.compare(attempt, this.password);
// }
// }

// export const UserSchema = SchemaFactory.createForClass(User);

// // Pre-save hook to hash password automatically
// UserSchema.pre<UserDocument>('save', async function (next) {
// if (this.isModified('password')) {
// const salt = await bcrypt.genSalt();
// this.password = await bcrypt.hash(this.password, salt);
// }
// next();
// });

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserDocument = User & Document;

// ✅ Define role enum
export enum Role {
  Admin = 'admin',
  User = 'user',
  Student = 'student',
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
  @Prop({ type: String, enum: Role, default: Role.Student })
  role: Role;
}

export const UserSchema = SchemaFactory.createForClass(User);
