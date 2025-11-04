// import {
//   Injectable,
//   UnauthorizedException,
//   ConflictException,
// } from '@nestjs/common';
// import { JwtService } from '@nestjs/jwt';
// import * as bcrypt from 'bcrypt';
// import { InjectModel } from '@nestjs/mongoose';
// import { Model } from 'mongoose';
// import { User, UserDocument } from '../users/schemas/user.schema';
// import { CreateUserDto } from './dto/create-user.dto';
// import { LoginDto } from './dto/login.dto';
// import { Types } from 'mongoose';

// @Injectable()
// export class AuthService {
//   constructor(
//     @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
//     private readonly jwtService: JwtService,
//   ) {}

//   // ✅ Register User
//   async register(createUserDto: CreateUserDto): Promise<UserDocument> {
//     const { name, email, password, role } = createUserDto;

//     const existingUser = await this.userModel.findOne({ email });
//     if (existingUser) {
//       throw new ConflictException('User already exists');
//     }

//     const hashedPassword = await bcrypt.hash(password, 10);

//     const newUser = new this.userModel({
//       name,
//       email,
//       password: hashedPassword,
//       role: role || 'student', // default role
//     });

//     return newUser.save();
//   }

//   // ✅ Login User
//   async login(loginDto: LoginDto) {
//     const { email, password } = loginDto;
// console.log('Login attempt for email:', email);

//     const user = await this.userModel.findOne({ email });
//     if (!user) throw new UnauthorizedException('Invalid credentials');

//     const isPasswordValid = await bcrypt.compare(password, user.password);
//     console.log('Password valid?', isPasswordValid);
//     if (!isPasswordValid)
//       throw new UnauthorizedException('Invalid credentials');

//     // Create JWT payload
//     const payload = {
//       sub: (user._id as Types.ObjectId).toString(),
//   email: user.email,
//   role: user.role,
//     };

//     const token = await this.jwtService.signAsync(payload);

//     return {
//       message: 'Login successful',
//       access_token: token,
//     };
//   }

//   // ✅ Validate User (for protected routes)
//   async validateUser(payload: any): Promise<UserDocument | null> {
//     const user = await this.userModel.findById(payload.sub).select('-password');
//     return user as unknown as UserDocument | null; // Fix TypeScript inference
//   }

//   // ✅ Get Profile (Protected Route)
//   async getProfile(userId: string): Promise<UserDocument | null> {
//     const user = await this.userModel.findById(userId).select('-password');
//     return user as unknown as UserDocument | null;
//   }
// }



import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common'; 
import { JwtService } from '@nestjs/jwt';
 import * as bcrypt from 'bcrypt'; 
import { InjectModel } from '@nestjs/mongoose'; import { Model, Types } from 'mongoose'; 
import { User, UserDocument } from '../users/schemas/user.schema';
 import { CreateUserDto } from './dto/create-user.dto';
  import { LoginDto } from './dto/login.dto';
  @Injectable()
   export class AuthService { constructor(
     @InjectModel(User.name) private readonly userModel: Model<UserDocument>, private readonly jwtService: JwtService, ) {}
     // ✅ Register user 
     async register(createUserDto: CreateUserDto): Promise<UserDocument> { const { name, email, password, role } = createUserDto; const existingUser = await this.userModel.findOne({ email: email.trim() }); if (existingUser) throw new ConflictException('User already exists'); const hashedPassword = await bcrypt.hash(password.trim(), 10); const newUser = new this.userModel({ name, email: email.trim(), password: hashedPassword, role: role || 'user', }); return newUser.save(); }
     // ✅ Login user 
     async login(loginDto: LoginDto) { const email = loginDto.email.trim(); const password = loginDto.password.trim(); const user = await this.userModel.findOne({ email }); if (!user) throw new UnauthorizedException('Invalid credentials'); const isPasswordValid = await bcrypt.compare(password, user.password); if (!isPasswordValid) throw new UnauthorizedException('Invalid credentials'); const payload = { sub: (user._id as Types.ObjectId).toString(), email: user.email, role: user.role }; const token = await this.jwtService.signAsync(payload); return { message: 'Login successful', access_token: token }; }
     // ✅ Validate JWT 
     async validateUser(payload: any): Promise<UserDocument | null> { return this.userModel.findById(payload.sub).select('-password'); } 
     // ✅ Get user profile by ID
     async getProfile(userId: string): Promise<UserDocument | null> { return this.userModel.findById(userId).select('-password'); } }