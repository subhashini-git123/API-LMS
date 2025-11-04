// import { Injectable } from '@nestjs/common';
// import { PassportStrategy } from '@nestjs/passport';
// import { ExtractJwt, Strategy } from 'passport-jwt';

// import { AuthService } from '../auth/auth.service';


// @Injectable()
// export class JwtStrategy extends PassportStrategy(Strategy) {
//   constructor(private authService: AuthService) {
//     super({
//       jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
//       ignoreExpiration: false,
//       secretOrKey: process.env.JWT_SECRET || 'mySecretKey',
//     });
//   }

//   async validate(payload: any) {
//     // attach user to request
//     const user = await this.authService.validateUser(payload);
//     return user
//       ? { userId: user._id, email: user.email, role: user.role }
//       : null;
//   }
// }

import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AuthService } from './auth.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET') || '', // ✅ ensures it's never undefined
    });
  }

  // ✅ Validate token payload
  async validate(payload: any) {
    const user = await this.authService.validateUser(payload);

    if (!user) {
      throw new UnauthorizedException('Invalid token or user not found');
    }

    return user; // attaches user to request (req.user)
  }
}
