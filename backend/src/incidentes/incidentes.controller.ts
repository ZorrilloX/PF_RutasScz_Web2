import { Controller, Post, Body, Get, Param, Put, Delete, Req, UploadedFile, BadRequestException } from "@nestjs/common";
import { IncidentesService } from "./incidentes.service";
import { CrearIncidenteDto, ActualizarIncidenteDto } from "./dto/incidentes.dto";
import { CustomRequest } from "src/auth/custom-request.interface";
import { UploadImage } from "src/decorators/upload.decorator";
import { ImagenesService } from "src/imagen-service/imagen-service.service";

@Controller("incidentes")
export class IncidentesController {
    constructor(
        private readonly incidentesService: IncidentesService,
        private imagenesService: ImagenesService,
    ) {}

    // Crear un nuevo incidente
    @Post()
    crearIncidente(@Body() incidenteData: CrearIncidenteDto, @Req() req: CustomRequest) {
        const usuarioId = req.user?.id;
        return this.incidentesService.crearIncidente(incidenteData, usuarioId);
    }

    // Obtener todos los incidentes verificados (público)
    @Get()
    getIncidentes() {
        return this.incidentesService.findAll();
    }

    // Obtener todos los incidentes (administradores/verificadores)
    @Get("admin")
    getIncidentesAdmin() {
        return this.incidentesService.findAllAdmin();
    }

    // Validar un incidente (verificador)
    @Put(":id/validar")
    validarIncidente(@Param("id") id: number, @Body() incidenteData: ActualizarIncidenteDto, @Req() req: CustomRequest) {
        const usuarioId = req.user?.id;
        return this.incidentesService.validarIncidente(id, incidenteData, usuarioId);
    }

    // Editar un incidente
    @Put(":id")
    editarIncidente(@Param("id") id: number, @Body() incidenteData: CrearIncidenteDto, @Req() req: CustomRequest) {
        const usuarioId = req.user?.id;
        return this.incidentesService.editarIncidente(id, incidenteData, usuarioId);
    }

    // Eliminar un incidente
    @Delete(":id")
    async eliminarIncidente(@Param("id") id: number, @Req() req: CustomRequest, @UploadedFile() archivo: Express.Multer.File) {
        const usuarioId = req.user?.id;
        //elimnamos tambien la imagen.
        await this.imagenesService.gestionarImagen(archivo, id, true);
        return this.incidentesService.eliminarIncidente(id, usuarioId);
    }

    @Post(":id/upload")
    @UploadImage()
    async uploadImagenIncidente(@Param("id") id: number, @UploadedFile() archivo: Express.Multer.File): Promise<string> {
        if (!archivo) throw new BadRequestException("Archivo de imagen no proporcionado");

        // Llamamos al servicio para gestionar la imagen
        await this.imagenesService.gestionarImagen(archivo, id, false);
        return "¡Éxito! Imagen del incidente subida correctamente.";
    }
}
