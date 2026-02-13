export interface JwtPayload {
    sub: string;
}
export interface RequestUser {
    userId: string;
}
export interface AuthUser {
    id: string;
    fullName: string;
    email: string;
    createdAt: Date;
}
export interface AuthResponse {
    user: AuthUser;
    token: string;
}
