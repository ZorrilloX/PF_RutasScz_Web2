import { Body, Controller, Delete, Get, NotFoundException, Param, Post, Put } from "@nestjs/common";
import { GenerosService } from "./generos.service";
import { Generos } from "./generos.model";
import { GeneroDto } from "./dto/generos.dto";

@Controller("generos")
export class GenerosController {
    constructor(private generosService: GenerosService) {}
    @Get()
    getList(): Promise<Generos[]> {
        return this.generosService.findAll();
    }
    @Get(":id")
    getById(@Param("id") id: number): Promise<Generos | null> {
        return this.generosService.findById(id);
    }
    @Post()
    createGenero(@Body() genero: GeneroDto): Promise<Generos> {
        return this.generosService.createGenero({
            id: 0,
            nombre: genero.nombre,
        });
    }
    @Put(":id")
    async updateGenero(@Param("id") id: number, @Body() genero: GeneroDto): Promise<Generos> {
        const generoDB = await this.generosService.findById(id);
        if (!generoDB) {
            throw new NotFoundException();
        }
        return this.generosService.updateGenero({
            id: id,
            nombre: genero.nombre,
        });
    }
    @Delete(":id")
    async deleteGenero(@Param("id") id: number): Promise<Generos> {
        const generoDB = await this.generosService.findById(id);
        if (!generoDB) {
            throw new NotFoundException();
        }
        return this.generosService.deleteGenero(generoDB);
    }
}
