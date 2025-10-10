// import { Controller } from '@nestjs/common';

// @Controller('auth')
// export class AuthController {}
import { Controller, Post, Body, Req, UseGuards, UnauthorizedException } from '@nestjs/common';import { AuthService } from './auth.service';import { UsersService } from '../users/users.service';import { JwtAuthGuard } from './jwt-auth.guard';
@Controller('auth')export class AuthController {
  constructor(private authService: AuthService,
    private usersService: UsersService
  ) {}

  @Post('register')
  async register(@Body() body: { name: string; email: string; password: string }) {
    const user = await this.usersService.createUser(body.name, body.email, body.password);
    const { password, ...result } = user.toObject();
    return result;
  }

  @Post('login')
  async login(@Body() body: { email: string; password: string }) {
    const user = await this.authService.validateUser(body.email, body.password);
    if (!user) throw new UnauthorizedException('Invalid credentials');
    return this.authService.login(user);
  }

  @UseGuards(JwtAuthGuard)
  @Post('profile')
  getProfile(@Req() req: any) {
    return req.user;
  }
}
