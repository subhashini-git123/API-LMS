
// // import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
// // import { Document } from 'mongoose';
// // import * as bcrypt from 'bcrypt';

// // export type UserDocument = User & Document;

// // @Schema()
// // export class User {
// //   @Prop({ required: true })
// //   name: string;

// //   @Prop({ required: true, unique: true })
// //   email: string;

// //   @Prop({ required: true })
// //   password: string;

// //   async validatePassword(password: string): Promise<boolean> {
// //     return bcrypt.compare(password, this.password);
// //   }
// // }

// // export const UserSchema = SchemaFactory.createForClass(User);

// // UserSchema.pre<UserDocument>('save', async function(next) {
// //   if (!this.isModified('password')) return next();
// //   const salt = await bcrypt.genSalt();
// //   this.password = await bcrypt.hash(this.password, salt);
// //   next();
// // });

// import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
// import { Document } from 'mongoose';

// @Schema()
// export class User extends Document {
//   @Prop({ required: true })
//   name: string;

//   @Prop({ required: true, unique: true })
//   email: string;

//   @Prop({ required: true })
//   password: string;
// }

// // Mongoose schema
// export const UserSchema = SchemaFactory.createForClass(User);

// // Type for Mongoose Document
// export type UserDocument = User & Document;
// src/users/schemas/user.schema.ts


// import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
// import { Document } from 'mongoose';

// export type UserDocument = User & Document;

// @Schema()
// export class User {
//   @Prop({ required: true })
//   name: string;

//   @Prop({ required: true, unique: true })
//   email: string;

//   @Prop({ required: true })
//   password: string;
// }

// export const UserSchema = SchemaFactory.createForClass(User);



// import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
// import { Document } from 'mongoose';

// export type UserDocument = User & Document;

// @Schema()
// export class User {
//   @Prop({ required: true })
//   name: string;

//   @Prop({ required: true, unique: true })
//   email: string;

//   @Prop({ required: true })
//   password: string;
// }

// export const UserSchema = SchemaFactory.createForClass(User);



import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserDocument = User & Document;

export enum Role {
  ADMIN = 'Admin/HR',
  MANAGER = 'Manager',
  TRAINEE = 'Trainee',
}

@Schema()
export class User {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({
    type: String,
    enum: Role,
    default: Role.TRAINEE,
  })
  role: Role;
}

export const UserSchema = SchemaFactory.createForClass(User);