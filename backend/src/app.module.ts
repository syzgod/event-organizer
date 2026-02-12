import { Controller, Get } from '@nestjs/common';

import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { ConfigService } from '@nestjs/config';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

// ── Health-check controller ────────────────────────────────
@Controller('health')
class HealthController {
  @Get()
  check() {
    return { status: 'ok' };
  }
}

// ── Root module ────────────────────────────────────────────
@Module({
  imports: [
    // Load .env variables globally
    ConfigModule.forRoot({
      isGlobal: true,
      validate: (env: Record<string, string | undefined>) => {
        const isProduction = env.NODE_ENV === 'production';

        if (isProduction && !env.MONGODB_URI) {
          throw new Error('MONGODB_URI is required in production');
        }

        if (isProduction && !env.JWT_SECRET) {
          throw new Error('JWT_SECRET is required in production');
        }

        return env;
      },
    }),

    // MongoDB connection (reads MONGODB_URI from env)
    MongooseModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        const isProduction = config.get<string>('NODE_ENV') === 'production';
        const mongodbUri = config.get<string>('MONGODB_URI');

        if (isProduction && !mongodbUri) {
          throw new Error('MONGODB_URI is required in production');
        }

        return {
          uri: mongodbUri ?? 'mongodb://localhost:27017/event-organizer',
        };
      },
    }),

    // Modular auth — can be extracted into its own package
    AuthModule,
  ],
  controllers: [HealthController],
})
export class AppModule {}
