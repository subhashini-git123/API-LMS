// import {
//   Injectable,
//   UnauthorizedException,
//   ConflictException,
// } from '@nestjs/common';
// import { JwtService } from '@nestjs/jwt';
// import * as bcrypt from 'bcrypt';
// import { InjectModel } from '@nestjs/mongoose';
// import { Model, Types } from 'mongoose';
// import { User, UserDocument } from '../users/schemas/user.schema';
// import { CreateUserDto } from './dto/create-user.dto';
// import { LoginDto } from './dto/login.dto';
// @Injectable()
// export class AuthService {
//   constructor(
//     @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
//     private readonly jwtService: JwtService,
//   ) {}
//   // ✅ Register user
//   async register(createUserDto: CreateUserDto): Promise<UserDocument> {
//     const { name, email, password, role } = createUserDto;
//     const existingUser = await this.userModel.findOne({ email: email.trim() });
//     if (existingUser) throw new ConflictException('User already exists');
//     const hashedPassword = await bcrypt.hash(password.trim(), 10);
//     const newUser = new this.userModel({
//       name,
//       email: email.trim(),
//       password: hashedPassword,
//       role: role || 'user',
//     });
//     return newUser.save();
//   }
//   // ✅ Login user
//   async login(loginDto: LoginDto) {
//     const email = loginDto.email.trim();
//     const password = loginDto.password.trim();
//     const user = await this.userModel.findOne({ email });
//     if (!user) throw new UnauthorizedException('Invalid credentials');
//     const isPasswordValid = await bcrypt.compare(password, user.password);
//     if (!isPasswordValid)
//       throw new UnauthorizedException('Invalid credentials');
//     const payload = {
//       sub: (user._id as Types.ObjectId).toString(),
//       email: user.email,
//       role: user.role,
//     };
//     const token = await this.jwtService.signAsync(payload);
//     return { message: 'Login successful', access_token: token };
//   }
//   // ✅ Validate JWT
//   async validateUser(payload: any): Promise<UserDocument | null> {
//     return this.userModel.findById(payload.sub).select('-password');
//   }
//   // ✅ Get user profile by ID
//   async getProfile(userId: string): Promise<UserDocument | null> {
//     return this.userModel.findById(userId).select('-password');
//   }
// }

import {
  Injectable,
  UnauthorizedException,
  ConflictException,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { User, UserDocument } from '../users/schemas/user.schema';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginDto } from './dto/login.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { ResetToken, ResetTokenDocument } from '../users/schemas/reset-token.schema';
import { MailService } from '../mail/mail.service';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
    @InjectModel(ResetToken.name) private readonly resetTokenModel: Model<ResetTokenDocument>,
    private readonly jwtService: JwtService,
    private readonly mailService: MailService,
  ) {}

  // ✅ Register user
  async register(createUserDto: CreateUserDto): Promise<UserDocument> {
    const { name, email, password, role } = createUserDto;
    const existingUser = await this.userModel.findOne({ email: email.trim() });
    if (existingUser) throw new ConflictException('User already exists');

    const hashedPassword = await bcrypt.hash(password.trim(), 10);
    const newUser = new this.userModel({
      name,
      email: email.trim(),
      password: hashedPassword,
      role: role || 'user',
    });

    return newUser.save();
  }

  // ✅ Login user
  async login(loginDto: LoginDto) {
    const email = loginDto.email.trim();
    const password = loginDto.password.trim();

    const user = await this.userModel.findOne({ email });
    if (!user) throw new UnauthorizedException('Invalid credentials');

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) throw new UnauthorizedException('Invalid credentials');

    const payload = {
      sub: (user._id as Types.ObjectId).toString(),
      email: user.email,
      role: user.role,
    };

    const token = await this.jwtService.signAsync(payload);
    return { message: 'Login successful', access_token: token };
  }

  // ✅ Validate JWT
  async validateUser(payload: any): Promise<UserDocument | null> {
    return this.userModel.findById(payload.sub).select('-password');
  }

  // ✅ Get user profile by ID
  async getProfile(userId: string): Promise<UserDocument | null> {
    return this.userModel.findById(userId).select('-password');
  }

  // 🔹 Forgot Password — generate and email reset link
  async forgotPassword(dto: ForgotPasswordDto) {
    const user = await this.userModel.findOne({ email: dto.email.trim() });
    if (!user) throw new NotFoundException('User not found');

    const token = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour expiry

    // delete old tokens
    await this.resetTokenModel.deleteMany({ email: user.email });

    await this.resetTokenModel.create({
      email: user.email,
      token,
      expiresAt,
    });

    const resetLink = `http://localhost:3000/reset-password?token=${token}`;

    await this.mailService.sendMail(
      user.email,
      'Password Reset Request',
      `Click this link to reset your password: ${resetLink}`,
    );

    return { message: 'Password reset link sent to your email.' };
  }

  // 🔹 Reset Password — verify token and update password
  async resetPassword(dto: ResetPasswordDto) {
    const record = await this.resetTokenModel.findOne({ token: dto.token });
    if (!record) throw new BadRequestException('Invalid or expired token');
    if (record.expiresAt < new Date()) throw new BadRequestException('Token expired');

    const user = await this.userModel.findOne({ email: record.email });
    if (!user) throw new NotFoundException('User not found');

    const hashed = await bcrypt.hash(dto.password.trim(), 10);
    user.password = hashed;
    await user.save();

    // delete token after successful reset
    await this.resetTokenModel.deleteOne({ token: dto.token });

    return { message: 'Password reset successful. You can now log in.' };
  }
}
