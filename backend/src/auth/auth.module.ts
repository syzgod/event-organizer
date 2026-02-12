import { ConfigModule, ConfigService } from '@nestjs/config';
import { User, UserSchema } from './schemas/user.schema';

import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { JwtSignOptions } from '@nestjs/jwt';
import { JwtStrategy } from './strategies/jwt.strategy';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PassportModule } from '@nestjs/passport';

/**
 * Self-contained authentication module.
 *
 * To reuse in another NestJS project:
 *   1. Copy the entire `auth/` folder.
 *   2. Import `AuthModule` in your root AppModule.
 *   3. Ensure `MONGODB_URI`, `JWT_SECRET` and `JWT_EXPIRES_IN`
 *      are available in your environment / ConfigService.
 */
@Module({
  imports: [
    // Register the User schema with Mongoose
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),

    // Passport for strategy-based auth
    PassportModule.register({ defaultStrategy: 'jwt' }),

    // JWT configuration — reads secret & expiry from env
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        const isProduction = config.get<string>('NODE_ENV') === 'production';
        const jwtSecret = config.get<string>('JWT_SECRET');
        const jwtExpiresIn = config.get<string>('JWT_EXPIRES_IN') ?? '7d';

        if (isProduction && !jwtSecret) {
          throw new Error('JWT_SECRET is required in production');
        }

        return {
          secret: jwtSecret ?? 'change-me-dev-only',
          signOptions: {
            expiresIn: jwtExpiresIn as JwtSignOptions['expiresIn'],
          },
        };
      },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
  exports: [AuthService, JwtModule, PassportModule],
})
export class AuthModule {}
