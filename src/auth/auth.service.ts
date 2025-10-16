// import { Injectable, UnauthorizedException } from '@nestjs/common';
// import { UsersService } from '../users/users.service';
// import { JwtService } from '@nestjs/jwt';
// import * as bcrypt from 'bcrypt';

// @Injectable()
// export class AuthService {
//   constructor(
//     private usersService: UsersService,
//     private jwtService: JwtService,
//   ) {}

//   async register(name: string, email: string, password: string) {
//     const existingUser = await this.usersService.findByEmail(email);
//     if (existingUser) throw new UnauthorizedException('User already exists');
//     const user = await this.usersService.create({ name, email, password });
//     const payload = { email: user.email, sub: user.id };
//     return {
//       access_token: this.jwtService.sign(payload),
//     };
//   }

//   async login(email: string, password: string) {
//     const user = await this.usersService.findByEmail(email);
//     if (!user) throw new UnauthorizedException('Invalid credentials');
//     const valid = await bcrypt.compare(password, user.password);
//     if (!valid) throw new UnauthorizedException('Invalid credentials');
//     const payload = { email: user.email, sub: user.id };
//     return {
//       access_token: this.jwtService.sign(payload),
//     };
//   }
// }
// import { Injectable } from '@nestjs/common';
// import { JwtService } from '@nestjs/jwt';
// import { UsersService } from '../users/users.service';
// import * as bcrypt from 'bcrypt';
// import { User } from '../users/schemas/user.schema';

// @Injectable()
// export class AuthService {
//   constructor(
//     private usersService: UsersService,
//     private jwtService: JwtService,
//   ) {}

//   async validateUser(email: string, password: string): Promise<User | null> {
//     const user = await this.usersService.findByEmail(email);
//     if (user && (await bcrypt.compare(password, user.password))) {
//       return user;
//     }
//     return null;
//   }

//   async login(user: User) {
//     const payload = { email: user.email, sub: user._id }; // Use _id from Mongoose Document
//     return {
//       access_token: this.jwtService.sign(payload),
//     };
//   }

//   async register(name: string, email: string, password: string) {
//     const user = await this.usersService.create({ name, email, password });
//     return this.login(user);
//   }
// }


// src/auth/auth.service.ts




// import { Injectable } from '@nestjs/common';
// import { InjectModel } from '@nestjs/mongoose';
// import { Model } from 'mongoose';
// import * as bcrypt from 'bcrypt';
// import { User, UserDocument } from '../users/schemas/user.schema';

// @Injectable()
// export class AuthService {
//   constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

//   async register(userData: { name: string; email: string; password: string }) {
//     const { name, email, password } = userData;

//     // Check if user already exists
//     const existingUser = await this.userModel.findOne({ email });
//     if (existingUser) {
//       return { message: 'User already exists' };
//     }

//     // Hash password and save user
//     const hashedPassword = await bcrypt.hash(password, 10);
//     const newUser = new this.userModel({ name, email, password: hashedPassword });
//     await newUser.save();

//     return { message: 'User registered successfully', user: { name, email } };
//   }

//   async validateUser(email: string, password: string): Promise<UserDocument | null> {
//     const user = await this.userModel.findOne({ email });
//     if (!user) return null;

//     const isMatch = await bcrypt.compare(password, user.password);
//     return isMatch ? user : null;
//   }

//   async login(user: UserDocument) {
//     // Normally you'd return a JWT here
//     return {
//       message: 'Login successful',
//       user: {
//         id: user._id,
//         name: user.name,
//         email: user.email,
//       },
//     };
//   }
// }



import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { User, UserDocument } from '../users/schemas/user.schema';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private jwtService: JwtService,
  ) {}

  async register(userData: { name: string; email: string; password: string }) {
    const { name, email, password } = userData;
    const existingUser = await this.userModel.findOne({ email });
    if (existingUser) return { message: 'User already exists' };

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new this.userModel({ name, email, password: hashedPassword });
    await newUser.save();
    return { message: 'User registered successfully', user: { name, email } };
  }

  async validateUser(email: string, password: string): Promise<UserDocument | null> {
    const user = await this.userModel.findOne({ email });
    if (!user) return null;
    const isMatch = await bcrypt.compare(password, user.password);
    return isMatch ? user : null;
  }

  async login(user: UserDocument) {
    const payload = { email: user.email, sub: user._id };
    const token = this.jwtService.sign(payload);
    return {
      message: 'Login successful',
      token,
    };
  }
}
