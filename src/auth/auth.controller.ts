// import {
//   Controller,
//   Post,
//   Body,
//   UseGuards,
//   Get,
//   Req,
// } from '@nestjs/common';
// import { AuthService } from './auth.service';
// import { CreateUserDto } from './dto/create-user.dto';
// import { LoginDto } from './dto/login.dto';
// import { JwtAuthGuard } from './jwt-auth.guard';
// import { Roles } from '../auth/roles/roles.decorator';
// import { RolesGuard } from '../auth/roles/roles.guard';

// @Controller('auth')
// export class AuthController {
//   constructor(private readonly authService: AuthService) {}

//   // ✅ Register
//   @Post('register')
//   async register(@Body() createUserDto: CreateUserDto) {
//     return this.authService.register(createUserDto);
//   }

//   // ✅ Login
//   @Post('login')
//   async login(@Body() loginDto: LoginDto) {
//     return this.authService.login(loginDto);
//   }

//   // ✅ Protected route (example)
//   @UseGuards(JwtAuthGuard, RolesGuard)
//   @Roles('admin', 'instructor', 'student')
//   @Get('profile')
//   getProfile(@Req() req) {
//     return req.user; // this is populated by JwtStrategy validate()
//   }
// }

// import { Controller, Post, Body } from '@nestjs/common';
// import { AuthService } from './auth.service';
//  import { CreateUserDto } from './dto/create-user.dto';
//   import { LoginDto } from './dto/login.dto'; @Controller('auth')
//    export class AuthController { constructor(private readonly authService: AuthService)
//      {

//      }
//      @Post('register') register(@Body() createUserDto: CreateUserDto)
//      {
//       return this.authService.register(createUserDto);

//     } @Post('login') login(@Body() loginDto: LoginDto)
//     {
//       return this.authService.login(loginDto);
//      }
//      }

import { Controller, Post, Get, Body, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginDto } from './dto/login.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @Post('register') register(@Body() dto: CreateUserDto) {
    return this.authService.register(dto);
  }
  @Post('login') login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }
  // ✅ Protected route - requires Bearer token
  @UseGuards(JwtAuthGuard) @Get('profile') async getProfile(@Req() req) {
    return this.authService.getProfile(req.user._id);
  }
}
