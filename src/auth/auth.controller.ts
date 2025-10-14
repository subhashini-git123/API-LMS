// import { Controller, Post, Body } from '@nestjs/common';
// import { AuthService } from './auth.service';

// @Controller('auth')
// export class AuthController {
//   constructor(private readonly authService: AuthService) {}
  

//   @Post('login')
//   async login(@Body() body: { email: string; password: string }) {
//     const { email, password } = body;

//     // First validate the user
//     const user = await this.authService.validateUser(email, password);
//     if (!user) {
//       return { message: 'Invalid credentials' };
//     }

//     // Pass the user object to login()
//     return this.authService.login(user);
//   }

//   @Post('register')
//   async register(@Body() body: { name: string; email: string; password: string }) {
//     const { name, email, password } = body;
//     return this.authService.register(name, email, password);
//   }
// }

// src/auth/auth.controller.ts
import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(@Body() body: { name: string; email: string; password: string }) {
    return this.authService.register(body);
  }

  @Post('login')
  async login(@Body() body: { email: string; password: string }) {
    const { email, password } = body;

    const user = await this.authService.validateUser(email, password);
    if (!user) {
      return { message: 'Invalid credentials' };
    }

    return this.authService.login(user);
  }
}
