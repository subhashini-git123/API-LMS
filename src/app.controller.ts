import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import type { Request } from 'express';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from './auth/roles/roles.guard';
import { Roles } from './auth/roles/roles.decorator';
import { Role } from './users/schemas/user.schema';
import { AuthService } from './auth/auth.service';

@Controller()
export class AppController {
  constructor(private readonly authService: AuthService) {}

  // 🏠 Public route
  @Get()
  getHello(): string {
    return 'Welcome to the LMS API 🚀';
  }

  // 👤 Protected route — requires JWT
  @UseGuards(AuthGuard('jwt'))
  @Get('profile')
  async getProfile(@Req() req: Request) {
    const user = await this.authService.getProfile((req.user as any).sub);
    return {
      message: 'User profile fetched successfully',
      user,
    };
  }

  // 🛡️ Admin-only route
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(Role.Admin)
  @Get('admin')
  getAdminDashboard() {
    return { message: 'Welcome Admin! You have full access.' };
  }

  // 👔 Manager-only route
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(Role.Manager)
  @Get('manager')
  getManagerDashboard() {
    return { message: 'Welcome Manager! Limited access granted.' };
  }

  // 👨‍🏫 Trainee-only route
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(Role.Trainee)
  @Get('trainee')
  getTraineeDashboard() {
    return { message: 'Welcome Trainee! Limited access granted.' };
  }
}

