import { Controller, Post, Body, Get, UseGuards } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { JwtAuthGuard } from "./jwt-auth.guard";

@Controller("auth")
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Post("login")
    async login(@Body() user: any) {
        if (user.email === "tests@example.com" && user.password === "123456") {
            const token = await this.authService.generateToken(user);
            return { accessToken: token }; // Devuelve el token
        }
        return { message: "Credenciales incorrectas" };
    }

    @UseGuards(JwtAuthGuard) // Protege esta ruta con el guard
    @Get()
    getProtectedData() {
        return { message: "Ruta protegida, token válido" };
    }
}
