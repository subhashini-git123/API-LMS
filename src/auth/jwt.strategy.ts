import { Injectable } from '@nestjs/common';
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
    // 👇 explicitly assert secretOrKey as string (not undefined)
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET') || 'default_secret', // fallback avoids type error
    });
  }

  async validate(payload: any) {
    // ✅ Make sure the payload returned is used as req.user
    return {
      sub: payload.sub,
      email: payload.email,
      role: payload.role,
    };
  }
}
