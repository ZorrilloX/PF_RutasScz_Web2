import { Controller, Get, Post, Body, Param, Put, Delete, UseGuards, Req } from "@nestjs/common";
import { CarreterasService } from "./carreteras.service";
import { CarreteraDto, UpdateCarreteraDto } from "./dto/carreteras.dto";
import { Carreteras } from "./carreteras.model";
import { Roles } from "src/auth/roles.decorator";
import { JwtAuthGuard } from "src/auth/jwt-auth.guard";
import { RolesGuard } from "src/auth/roles.guard";
import { CustomRequest } from "src/auth/custom-request.interface";

@Controller("carreteras")
export class CarreterasController {
    constructor(private readonly carreterasService: CarreterasService) {}

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles("administrador", "verificador")
    @Post()
    async create(@Body() carreteraData: CarreteraDto, @Req() req: CustomRequest): Promise<Carreteras> {
        const usuarioId = req.user?.id;
        console.log(carreteraData);
        return this.carreterasService.createCarretera(carreteraData, usuarioId);
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles("administrador", "verificador")
    @Get()
    async findAll(): Promise<Carreteras[]> {
        return this.carreterasService.findAll();
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles("administrador", "verificador")
    @Get(":id")
    async findById(@Param("id") id: number): Promise<Carreteras> {
        return this.carreterasService.findById(id);
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles("administrador", "verificador")
    @Put(":id")
    async update(@Param("id") id: number, @Body() carreteraData: UpdateCarreteraDto, @Req() req: CustomRequest): Promise<Carreteras> {
        const usuarioId = req.user?.id;
        return this.carreterasService.updateCarretera(id, carreteraData, usuarioId);
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles("administrador", "verificador")
    @Delete(":id")
    async delete(@Param("id") id: number, @Req() req: CustomRequest): Promise<void> {
        const usuarioId = req.user?.id;
        return this.carreterasService.deleteCarretera(id, usuarioId);
    }
}
