import * as bcrypt from 'bcrypt';

import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { User, UserDocument } from './schemas/user.schema';

import { InjectModel } from '@nestjs/mongoose';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from './dto/login.dto';
import { Model } from 'mongoose';
import { RegisterDto } from './dto/register.dto';

const SALT_ROUNDS = 12;
const DUPLICATE_KEY_ERROR_CODE = 11000;

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
    private readonly jwtService: JwtService,
  ) {}

  // ── Register ─────────────────────────────────────────────
  async register(dto: RegisterDto) {
    const email = dto.email.trim().toLowerCase();
    const fullName = dto.fullName.trim();

    const existing = await this.userModel.findOne({ email });
    if (existing) {
      throw new ConflictException('Email is already registered');
    }

    const hashedPassword = await bcrypt.hash(dto.password, SALT_ROUNDS);

    try {
      const user = await this.userModel.create({
        fullName,
        email,
        password: hashedPassword,
      });

      const token = this.signToken(user._id.toString());

      return {
        user: this.sanitize(user),
        token,
      };
    } catch (error: unknown) {
      if (this.isDuplicateEmailError(error)) {
        throw new ConflictException('Email is already registered');
      }

      throw error;
    }
  }

  // ── Login ────────────────────────────────────────────────
  async login(dto: LoginDto) {
    const email = dto.email.trim().toLowerCase();
    const user = await this.userModel.findOne({ email }).select('+password');

    if (!user || !(await bcrypt.compare(dto.password, user.password))) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const token = this.signToken(user._id.toString());

    return {
      user: this.sanitize(user),
      token,
    };
  }

  // ── Get profile ──────────────────────────────────────────
  async getProfile(userId: string) {
    const user = await this.userModel.findById(userId);
    if (!user) {
      throw new UnauthorizedException('User not found');
    }
    return this.sanitize(user);
  }

  // ── Helpers ──────────────────────────────────────────────
  private signToken(userId: string): string {
    return this.jwtService.sign({ sub: userId });
  }

  private sanitize(user: UserDocument) {
    return {
      id: user._id,
      fullName: user.fullName,
      email: user.email,
      createdAt: user.createdAt,
    };
  }

  private isDuplicateEmailError(error: unknown): boolean {
    if (!error || typeof error !== 'object') {
      return false;
    }

    const maybeMongoError = error as { code?: number; keyPattern?: Record<string, unknown> };
    return (
      maybeMongoError.code === DUPLICATE_KEY_ERROR_CODE &&
      Boolean(maybeMongoError.keyPattern?.['email'])
    );
  }
}
