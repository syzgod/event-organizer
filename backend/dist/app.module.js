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
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const auth_module_1 = require("./auth/auth.module");
const config_1 = require("@nestjs/config");
const config_2 = require("@nestjs/config");
const common_2 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
let HealthController = class HealthController {
    check() {
        return { status: 'ok' };
    }
};
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], HealthController.prototype, "check", null);
HealthController = __decorate([
    (0, common_1.Controller)('health')
], HealthController);
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_2.Module)({
        imports: [
            config_1.ConfigModule.forRoot({
                isGlobal: true,
                validate: (env) => {
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
            mongoose_1.MongooseModule.forRootAsync({
                inject: [config_2.ConfigService],
                useFactory: (config) => {
                    const isProduction = config.get('NODE_ENV') === 'production';
                    const mongodbUri = config.get('MONGODB_URI');
                    if (isProduction && !mongodbUri) {
                        throw new Error('MONGODB_URI is required in production');
                    }
                    return {
                        uri: mongodbUri ?? 'mongodb://localhost:27017/event-organizer',
                    };
                },
            }),
            auth_module_1.AuthModule,
        ],
        controllers: [HealthController],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map