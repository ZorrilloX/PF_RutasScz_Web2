import { IsNotEmpty, IsString } from "class-validator";

export class GeneroDto {
    readonly id: number;
    @IsNotEmpty()
    @IsString()
    readonly nombre: string;
}
