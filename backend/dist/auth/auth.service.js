"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const bcrypt = require("bcrypt");
const common_1 = require("@nestjs/common");
const user_schema_1 = require("./schemas/user.schema");
const mongoose_1 = require("@nestjs/mongoose");
const jwt_1 = require("@nestjs/jwt");
const mongoose_2 = require("mongoose");
const SALT_ROUNDS = 12;
const DUPLICATE_KEY_ERROR_CODE = 11000;
let AuthService = class AuthService {
    userModel;
    jwtService;
    constructor(userModel, jwtService) {
        this.userModel = userModel;
        this.jwtService = jwtService;
    }
    async register(dto) {
        const email = dto.email.trim().toLowerCase();
        const fullName = dto.fullName.trim();
        const existing = await this.userModel.findOne({ email });
        if (existing) {
            throw new common_1.ConflictException('Email is already registered');
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
        }
        catch (error) {
            if (this.isDuplicateEmailError(error)) {
                throw new common_1.ConflictException('Email is already registered');
            }
            throw error;
        }
    }
    async login(dto) {
        const email = dto.email.trim().toLowerCase();
        const user = await this.userModel.findOne({ email }).select('+password');
        if (!user || !(await bcrypt.compare(dto.password, user.password))) {
            throw new common_1.UnauthorizedException('Invalid email or password');
        }
        const token = this.signToken(user._id.toString());
        return {
            user: this.sanitize(user),
            token,
        };
    }
    async getProfile(userId) {
        const user = await this.userModel.findById(userId);
        if (!user) {
            throw new common_1.UnauthorizedException('User not found');
        }
        return this.sanitize(user);
    }
    signToken(userId) {
        return this.jwtService.sign({ sub: userId });
    }
    sanitize(user) {
        return {
            id: user._id,
            fullName: user.fullName,
            email: user.email,
            createdAt: user.createdAt,
        };
    }
    isDuplicateEmailError(error) {
        if (!error || typeof error !== 'object') {
            return false;
        }
        const maybeMongoError = error;
        return (maybeMongoError.code === DUPLICATE_KEY_ERROR_CODE &&
            Boolean(maybeMongoError.keyPattern?.['email']));
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(user_schema_1.User.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        jwt_1.JwtService])
], AuthService);
//# sourceMappingURL=auth.service.js.map