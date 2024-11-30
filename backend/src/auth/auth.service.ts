import { Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";

@Injectable()
export class AuthService {
    constructor(private readonly jwtService: JwtService) {}

    // Método para generar un token
    async generateToken(user: any): Promise<string> {
        const payload = { email: user.email, role: user.role }; // Datos a incluir en el token
        return this.jwtService.sign(payload); // Genera el token
    }
}

//Este servicio generará el token usando JwtService
