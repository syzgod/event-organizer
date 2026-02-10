import { AuthGuard } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';

/**
 * Guard that protects routes with JWT authentication.
 * Usage: @UseGuards(JwtAuthGuard)
 */
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {}
