import { Body, Controller, Delete, Get, NotFoundException, Param, Post, Put, Req, UseGuards } from "@nestjs/common";
import { MunicipiosService } from "./municipios.service";
import { Municipios } from "./municipios.model";
import { MunicipioDto } from "./dto/municipios.dto";
import { Roles } from "src/auth/roles.decorator";
import { JwtAuthGuard } from "src/auth/jwt-auth.guard";
import { RolesGuard } from "src/auth/roles.guard";
import { CustomRequest } from "src/auth/custom-request.interface";

@Controller("municipios")
export class MunicipiosController {
    constructor(private municipiosService: MunicipiosService) {}

    // Listar todos los municipios
    @Get()
    async list(): Promise<Municipios[]> {
        return this.municipiosService.findAll();
    }

    // Obtener un municipio por id
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles("administrador", "verificador")
    @Get(":id")
    async get(@Param("id") id: number): Promise<Municipios> {
        const municipio = await this.municipiosService.findById(id);
        if (!municipio) throw new NotFoundException("Municipio no encontrado");
        return municipio;
    }

    // Crear un nuevo municipio
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles("administrador", "verificador")
    @Post()
    async create(@Body() municipioData: MunicipioDto, @Req() req: CustomRequest): Promise<Municipios> {
        const usuarioId = req.user?.id;
        console.log("Solicitud al endpoint crear municipio recibida");
        return this.municipiosService.createMunicipio(municipioData, usuarioId);
    }

    // Actualizar un municipio
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles("administrador", "verificador")
    @Put(":id")
    async update(@Param("id") id: number, @Body() municipioData: MunicipioDto, @Req() req: CustomRequest): Promise<Municipios> {
        const usuarioId = req.user?.id;
        return this.municipiosService.updateMunicipio(id, municipioData, usuarioId);
    }

    // Eliminar un municipio
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles("administrador", "verificador")
    @Delete(":id")
    async delete(@Param("id") id: number, @Req() req: CustomRequest): Promise<void> {
        const usuarioId = req.user?.id;
        await this.municipiosService.deleteMunicipio(id, usuarioId);
    }
}
