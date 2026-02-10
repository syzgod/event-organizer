import { Controller, Get } from '@nestjs/common';

import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
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
    ConfigModule.forRoot({ isGlobal: true }),

    // MongoDB connection (reads MONGODB_URI from env)
    MongooseModule.forRoot(process.env.MONGODB_URI || 'mongodb://localhost:27017/event-organizer'),

    // Modular auth — can be extracted into its own package
    AuthModule,
  ],
  controllers: [HealthController],
})
export class AppModule {}
