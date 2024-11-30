import { IsNotEmpty, IsString, IsArray, IsOptional, IsObject, IsNumber } from "class-validator";

export class CarreteraDto {
    @IsNotEmpty()
    @IsString()
    nombre: string;

    @IsNotEmpty()
    @IsNumber()
    municipioOrigen: number;

    @IsNotEmpty()
    @IsNumber()
    municipioDestino: number;

    @IsNotEmpty()
    @IsString()
    estado: string; // "libre" o "bloqueada"

    @IsOptional()
    @IsString()
    razonBloqueo?: string;

    @IsNotEmpty()
    @IsArray()
    @IsObject({ each: true })
    puntos: { lat: number; lng: number }[]; // Coordenadas de la ruta
}

export class UpdateCarreteraDto {
    @IsOptional()
    @IsString()
    nombre?: string;

    @IsOptional()
    @IsNumber()
    municipioOrigen?: number;

    @IsOptional()
    @IsNumber()
    municipioDestino?: number;

    @IsOptional()
    @IsString()
    estado?: string;

    @IsOptional()
    @IsString()
    razonBloqueo?: string;

    @IsOptional()
    @IsArray()
    @IsObject({ each: true })
    puntos?: { lat: number; lng: number }[];
}
