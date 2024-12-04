import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor() {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), // Extrae el token del encabezado
            ignoreExpiration: false, // Rechaza tokens expirados
            secretOrKey: "INDIGO es el mejor <3",
        });
    }

    async validate(payload: any) {
        console.log("Payload recibido en JwtStrategy:", payload);
        // Los datos del payload estan disponibles aqui ;3
        return { id: payload.sub, email: payload.email, role: payload.rol };
    }
}
