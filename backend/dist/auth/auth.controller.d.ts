import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
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
    getProfile(req: {
        user: {
            userId: string;
        };
    }): Promise<{
        id: import("mongoose").Types.ObjectId;
        fullName: string;
        email: string;
        createdAt: Date;
    }>;
}
