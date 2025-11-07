import { Controller, Get, UseGuards, Req } from '@nestjs/common';
import { Roles } from '../auth/roles/roles.decorator';
import { RolesGuard } from '../auth/roles/roles.guard';
import { AuthGuard } from '@nestjs/passport';
import type { Request } from 'express';
import { Role } from '../users/schemas/user.schema';

@Controller('dashboard')
@UseGuards(AuthGuard('jwt'), RolesGuard) // ✅ Apply guards once at controller level (optional but cleaner)
export class DashboardController {

  @Get('admin')
  @Roles(Role.Admin)
  getAdminDashboard(@Req() req: Request) {
    const user = req.user as any;
    return { message: `Welcome Admin ${user.email}` };
  }

  @Get('manager')
  @Roles(Role.Manager)
  getManagerDashboard(@Req() req: Request) {
    const user = req.user as any;
    return { message: `Welcome Manager ${user.email}` };
  }

  @Get('trainee')
  @Roles(Role.Trainee)
  getTraineeDashboard(@Req() req: Request) {
    const user = req.user as any;
    return { message: `Welcome Trainee ${user.email}` };
  }
}
