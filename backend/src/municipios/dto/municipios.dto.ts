import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class MunicipioDto {
    @IsNotEmpty()
    @IsString()
    readonly nombre: string;

    @IsNotEmpty()
    @IsNumber()
    readonly lat: number;

    @IsNotEmpty()
    @IsNumber()
    readonly lng: number;
}
