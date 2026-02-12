import { UserDocument } from './schemas/user.schema';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from './dto/login.dto';
import { Model } from 'mongoose';
import { RegisterDto } from './dto/register.dto';
export declare class AuthService {
    private readonly userModel;
    private readonly jwtService;
    constructor(userModel: Model<UserDocument>, jwtService: JwtService);
    register(dto: RegisterDto): Promise<{
        user: {
            id: import("mongoose").Types.ObjectId;
            fullName: string;
            email: string;
            createdAt: Date;
        };
        token: string;
    }>;
    login(dto: LoginDto): Promise<{
        user: {
            id: import("mongoose").Types.ObjectId;
            fullName: string;
            email: string;
            createdAt: Date;
        };
        token: string;
    }>;
    getProfile(userId: string): Promise<{
        id: import("mongoose").Types.ObjectId;
        fullName: string;
        email: string;
        createdAt: Date;
    }>;
    private signToken;
    private sanitize;
    private isDuplicateEmailError;
}
