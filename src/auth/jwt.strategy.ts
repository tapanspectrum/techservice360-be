// jwt.strategy.ts
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AuthService } from './auth.service';
import { Request } from 'express';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    const cookieExtractor = (req: Request): string | null => {
      if (req?.cookies?.access_token) {
        return req.cookies.access_token;
      }
      return null;
    };

    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        ExtractJwt.fromAuthHeaderAsBearerToken(),
        cookieExtractor,
      ]),
      secretOrKey: process.env.JWT_SECRET || 'secretKey',
    });
     console.log('JWT Strategy initialized');
  }

  async validate(payload: any) {
    console.log('JWT Payload:', payload);
    const user = await this.authService.validateUser(payload.sub);
    if (!user) return null;
    return user; // attaches user to request.user
  }
}
