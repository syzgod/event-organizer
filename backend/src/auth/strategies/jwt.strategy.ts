import { ExtractJwt, Strategy } from 'passport-jwt';

import { ConfigService } from '@nestjs/config';
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';

/**
 * Validates JWT tokens and attaches the decoded payload to `req.user`.
 * The payload shape is `{ sub: userId, iat, exp }`.
 */
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(config: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: config.get<string>('JWT_SECRET', 'change-me'),
    });
  }

  /**
   * Called after the token is verified.
   * The returned object is attached to `req.user`.
   */
  validate(payload: { sub: string }) {
    return { userId: payload.sub };
  }
}
