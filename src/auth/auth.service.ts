// import { Injectable } from '@nestjs/common';

// @Injectable()
// export class AuthService {}
import { Injectable, UnauthorizedException } from '@nestjs/common';import { UsersService } from '../users/users.service';import { JwtService } from '@nestjs/jwt';import * as bcrypt from 'bcrypt';
@Injectable()export class AuthService {
  constructor(private usersService: UsersService,
    private jwtService: JwtService
  ) {}

  async validateUser(email: string, password: string) {
    const user = await this.usersService.findByEmail(email);
    if (user && (await bcrypt.compare(password, user.password))) {
      const { password, ...result } = user.toObject();
      return result;
    }
    return null;
  }

  async login(user: any) {
    const payload = { email: user.email, sub: user._id };
    return { access_token: this.jwtService.sign(payload) };
  }
}
