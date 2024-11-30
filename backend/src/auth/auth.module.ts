import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { AuthService } from "./auth.service";
import { JwtStrategy } from "./jwt.strategy";
import { PassportModule } from "@nestjs/passport";
import { AuthController } from "./auth.controller";

@Module({
    imports: [
        PassportModule,
        JwtModule.register({
            secret: "INDIGO es el mejor <3", // Cambia por tu clave secreta (usa variables de entorno en producción)
            signOptions: { expiresIn: "1h" }, // El token expirará en 1 hora
        }),
    ],
    controllers: [AuthController],
    providers: [AuthService, JwtStrategy],
    exports: [AuthService], // Exportamos para usar en otros módulos si es necesario
})
export class AuthModule {}
