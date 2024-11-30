import { IsNotEmpty, IsString, IsObject, IsNumber, IsBoolean } from "class-validator";

export class CrearIncidenteDto {
    @IsString()
    @IsNotEmpty()
    tipo: string;

    @IsString()
    @IsNotEmpty()
    descripcion: string;

    @IsNotEmpty()
    @IsObject({ each: true })
    ubicacion: { lat: number; lng: number };

    @IsNumber()
    @IsNotEmpty()
    carreteraId: number; // Relación con la carretera
}

export class ActualizarIncidenteDto {
    @IsBoolean()
    verificado: boolean;
}
