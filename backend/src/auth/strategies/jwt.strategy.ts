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
    const isProduction = config.get<string>('NODE_ENV') === 'production';
    const jwtSecret = config.get<string>('JWT_SECRET');

    if (isProduction && !jwtSecret) {
      throw new Error('JWT_SECRET is required in production');
    }

    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: jwtSecret ?? 'change-me-dev-only',
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
