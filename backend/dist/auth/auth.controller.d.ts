import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RequestUser } from './auth.types';
import { RegisterDto } from './dto/register.dto';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    register(dto: RegisterDto): Promise<import("./auth.types").AuthResponse>;
    login(dto: LoginDto): Promise<import("./auth.types").AuthResponse>;
    getProfile(req: {
        user: RequestUser;
    }): Promise<import("./auth.types").AuthUser>;
}
