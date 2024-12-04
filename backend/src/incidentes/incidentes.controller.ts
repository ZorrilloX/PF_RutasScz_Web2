import { Controller, Post, Body, Get, Param, Put, Delete, Req, UploadedFile, BadRequestException, UseGuards } from "@nestjs/common";
import { IncidentesService } from "./incidentes.service";
import { CrearIncidenteDto, ActualizarIncidenteDto } from "./dto/incidentes.dto";
import { CustomRequest } from "src/auth/custom-request.interface";
import { UploadImage } from "src/decorators/upload.decorator";
import { ImagenesService } from "src/imagen-service/imagen-service.service";
import { Roles } from "src/auth/roles.decorator";
import { JwtAuthGuard } from "src/auth/jwt-auth.guard";
import { RolesGuard } from "src/auth/roles.guard";

@Controller("incidentes")
export class IncidentesController {
    constructor(
        private readonly incidentesService: IncidentesService,
        private imagenesService: ImagenesService,
    ) {}

    // Crear un nuevo incidente
    @Post()
    async crearIncidente(@Body() incidenteData: CrearIncidenteDto, @Req() req: CustomRequest) {
        const usuarioId = req.user?.id;
        const incidente = this.incidentesService.crearIncidente(incidenteData, usuarioId);
        return incidente;
    }

    // Obtener todos los incidentes verificados (público)
    @Get()
    getIncidentes() {
        return this.incidentesService.findAll();
    }

    // Obtener todos los incidentes (administradores/verificadores)
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles("administrador", "verificador")
    @Get("admin")
    getIncidentesAdmin() {
        return this.incidentesService.findAllAdmin();
    }

    @Get(":id/IdDeCarretera") //conseguimos con el id de carretera el primer indicente validado.
    async obtenerUltimoIncidenteVerificado(@Param("id") id: string) {
        const incidente = await this.incidentesService.obtenerUltimoIncidenteVerificadoPorCarretera(Number(id));
        if (!incidente) {
            return { mensaje: "No se encontró ningún incidente verificado para esta carretera" };
        }
        return { incidenteId: incidente.id };
    }

    // Validar un incidente (verificador)
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles("administrador", "verificador")
    @Put(":id/validar")
    validarIncidente(@Param("id") id: number, @Body() incidenteData: ActualizarIncidenteDto, @Req() req: CustomRequest) {
        const usuarioId = req.user?.id;
        return this.incidentesService.validarIncidente(id, incidenteData, usuarioId);
    }

    // Editar un incidente
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles("administrador", "verificador")
    @Put(":id")
    editarIncidente(@Param("id") id: number, @Body() incidenteData: CrearIncidenteDto, @Req() req: CustomRequest) {
        const usuarioId = req.user?.id;
        return this.incidentesService.editarIncidente(id, incidenteData, usuarioId);
    }

    // Eliminar un incidente
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles("administrador", "verificador")
    @Delete(":id")
    async eliminarIncidente(@Param("id") id: number, @Req() req: CustomRequest, @UploadedFile() archivo: Express.Multer.File) {
        const usuarioId = req.user?.id;
        //elimnamos tambien la imagen.
        await this.imagenesService.gestionarImagen(archivo, id, true);
        return this.incidentesService.eliminarIncidente(id, usuarioId);
    }

    @Post(":id/upload-image")
    @UploadImage()
    async uploadImagenIncidente(@Param("id") id: number, @UploadedFile() archivo: Express.Multer.File): Promise<string> {
        if (!archivo) throw new BadRequestException("Archivo de imagen no proporcionado");

        // Llamamos al servicio para gestionar la imagen
        await this.imagenesService.gestionarImagen(archivo, id, false);
        return "¡Éxito! Imagen del incidente subida correctamente.";
    }
}
