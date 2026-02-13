import { AuthResponse, AuthUser } from './auth.types';
import { UserDocument } from './schemas/user.schema';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from './dto/login.dto';
import { Model } from 'mongoose';
import { RegisterDto } from './dto/register.dto';
export declare class AuthService {
    private readonly userModel;
    private readonly jwtService;
    constructor(userModel: Model<UserDocument>, jwtService: JwtService);
    register(dto: RegisterDto): Promise<AuthResponse>;
    login(dto: LoginDto): Promise<AuthResponse>;
    getProfile(userId: string): Promise<AuthUser>;
    private signToken;
    private sanitize;
    private buildAuthResponse;
    private isDuplicateEmailError;
}
