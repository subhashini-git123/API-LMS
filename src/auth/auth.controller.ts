// import { Controller,Post,Body,Get,UseGuards,Request,} from '@nestjs/common';
// import { AuthService } from './auth.service';
// import { JwtAuthGuard } from './jwt-auth.guard';
// import { RegisterDto } from './dto/register.dto';
// import { LoginDto } from './dto/login.dto';

// @Controller('auth')
// export class AuthController {
//   constructor(private readonly authService: AuthService) {}

//   // Register endpoint using DTO with validation
//   @Post('register')
//   async register(@Body() body: RegisterDto) {
//     return this.authService.register(body);
//   }

//   // Login endpoint using DTO with validation
//   @Post('login')
//   async login(@Body() body: LoginDto) {
//     const user = await this.authService.validateUser(body.email, body.password);
//     if (!user) {
//       return { message: 'Invalid credentials' };
//     }
//     return this.authService.login(user);
//   }

//   // Protected route with JWT guard
//   @UseGuards(JwtAuthGuard)
//   @Get('profile')
//   getProfile(@Request() req) {
//     return {
//       message: 'This is a protected route',
//       user: req.user,
//     };
//   }
// }



import { 
  Controller, 
  Post, 
  Get, 
  Body, 
  UseGuards, 
  Request, 
  UnauthorizedException 
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './jwt-auth.guard';
import { RolesGuard } from './roles/roles.guard';
import { Roles } from './roles/roles.decorator';
import { Role } from '../users/schemas/user.schema';
import { ApiTags, ApiOperation, ApiResponse, ApiBody, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // 🧩 Register (anyone can register)
  @Post('register')
  @ApiOperation({ summary: 'Register a new user (anyone can register)' })
  @ApiResponse({ status: 201, description: 'User registered successfully' })
  @ApiResponse({ status: 409, description: 'User already exists' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        name: { type: 'string', example: 'John Doe' },
        email: { type: 'string', example: 'john@example.com' },
        password: { type: 'string', example: 'Password123' },
        role: { 
          type: 'string', 
          enum: ['Admin/HR', 'Manager', 'Trainee'],
          example: 'Trainee'
        },
      },
      required: ['name', 'email', 'password', 'role'],
    },
  })
  register(@Body() userData) {
    return this.authService.register(userData);
  }

  // 🧩 Login route
  @Post('login')
  @ApiOperation({ summary: 'Login with email and password' })
  @ApiResponse({ status: 200, description: 'Login successful' })
  @ApiResponse({ status: 401, description: 'Invalid credentials' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        email: { type: 'string', example: 'john@example.com' },
        password: { type: 'string', example: 'Password123' },
      },
      required: ['email', 'password'],
    },
  })
  async login(@Body() body) {
    const user = await this.authService.validateUser(body.email, body.password);
    if (!user) throw new UnauthorizedException('Invalid credentials');
    return this.authService.login(user);
  }

  // 🧩 Protected route (Profile)
  // Accessible by any authenticated user (not role-restricted)
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('access-token')
  @Get('profile')
  @ApiOperation({ summary: 'Get your own profile (any logged-in user)' })
  @ApiResponse({ status: 200, description: 'Returns logged-in user info' })
  @ApiResponse({ status: 401, description: 'Unauthorized - Invalid or missing token' })
  getProfile(@Request() req) {
    // req.user comes from JWT payload (via JwtStrategy)
    return {
      message: 'Profile retrieved successfully',
      user: {
        id: req.user.userId,
        email: req.user.email,
        role: req.user.role,
      },
    };
  }
}
