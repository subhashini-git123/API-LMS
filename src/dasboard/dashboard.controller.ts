import { Controller, Get, UseGuards, Req } from '@nestjs/common';
import { Roles } from '../auth/roles/roles.decorator';
import { RolesGuard } from '../auth/roles/roles.guard';
import { AuthGuard } from '@nestjs/passport';
import type { Request } from 'express';

@Controller('dashboard')
export class DashboardController {
  @Get('admin')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('admin')
  getAdminDashboard(@Req() req: Request) {
    const user = req.user as any; // ✅ TypeScript-safe cast
    return { message: `Welcome Admin ${user.email}` };
  }

  @Get('student')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('student')
  getStudentDashboard(@Req() req: Request) {
    const user = req.user as any;
    return { message: `Welcome Student ${user.email}` };
  }

  @Get('instructor')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('instructor')
  getInstructorDashboard(@Req() req: Request) {
    const user = req.user as any;
    return { message: `Welcome Instructor ${user.email}` };
  }
}
