import { IsNotEmpty, IsEmail, IsString } from "class-validator";

export class UsuarioDto {
    @IsNotEmpty()
    @IsEmail()
    email: string;

    @IsNotEmpty()
    @IsString()
    password: string;

    @IsNotEmpty()
    @IsString()
    rol: string; // 'administrador' o 'verificador'
}

export class UpdateUsuarioDto {
    @IsNotEmpty()
    @IsString()
    password: string;

    @IsNotEmpty()
    @IsString()
    rol: string; // 'administrador' o 'verificador'
}
