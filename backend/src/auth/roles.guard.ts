import { Injectable, CanActivate, ExecutionContext } from "@nestjs/common";
import { Observable } from "rxjs";
import { JwtService } from "@nestjs/jwt";
import { Reflector } from "@nestjs/core";

@Injectable()
export class RolesGuard implements CanActivate {
    constructor(
        private jwtService: JwtService,
        private reflector: Reflector,
    ) {}

    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
        const request = context.switchToHttp().getRequest();
        const token = request.headers.authorization?.split(" ")[1]; // Obtenemos el token
        if (!token) return false;

        const decoded = this.jwtService.decode(token) as any;
        const roles = this.reflector.get<string[]>("roles", context.getHandler());

        console.log("Token decodificado:", decoded); // Verifica que el rol esté en "rol"
        console.log("Roles requeridos:", roles); // Asegúrate de que los roles que se están pasando son correctos

        if (roles) {
            console.log("Comprobando si el rol del usuario está en los roles permitidos...");
            const hasRole = roles.includes(decoded.rol); // Usa "rol" en lugar de "role"
            console.log(`¿El usuario tiene acceso? ${hasRole}`);
            return hasRole;
        }

        return true;
    }
}
