import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Incidentes } from "./incidentes.model";
import { Carreteras } from "src/carreteras/carreteras.model";
import { CrearIncidenteDto, ActualizarIncidenteDto } from "./dto/incidentes.dto";
import { LogsService } from "../logs/logs.service";

@Injectable()
export class IncidentesService {
    constructor(
        @InjectRepository(Incidentes)
        private incidentesRepository: Repository<Incidentes>,
        private readonly logsService: LogsService,
        @InjectRepository(Carreteras)
        private carreterasRepository: Repository<Carreteras>,
    ) {}

    // Crear un nuevo incidente
    async crearIncidente(incidenteData: CrearIncidenteDto, usuarioId: number): Promise<Incidentes> {
        const carretera = await this.carreterasRepository.findOneBy({ id: incidenteData.carreteraId });

        if (!carretera) throw new NotFoundException("Carretera no encontrada");

        const incidente = this.incidentesRepository.create({
            tipo: incidenteData.tipo,
            descripcion: incidenteData.descripcion,
            ubicacion: incidenteData.ubicacion,
            carretera: carretera,
            verificado: false, // al inicio NO está verificado
        });
        await this.logsService.registrarCambio("incidentes", "crear", carretera, usuarioId);
        return this.incidentesRepository.save(incidente);
    }

    // Obtener todos los incidentes, solo los verificados se muestran públicamente
    findAll(): Promise<Incidentes[]> {
        return this.incidentesRepository.find({
            where: { verificado: true },
            relations: ["carretera"], // Relación con carretera
        });
    }

    // Obtener todos los incidentes, sin importar si están verificados o no (para administradores o verificadores)
    findAllAdmin(): Promise<Incidentes[]> {
        return this.incidentesRepository.find({
            relations: ["carretera"],
        });
    }

    async obtenerUltimoIncidenteVerificadoPorCarretera(carreteraId: number): Promise<Incidentes | null> {
        return await this.incidentesRepository.findOne({
            where: {
                carretera: { id: carreteraId },
                verificado: true,
            },
            order: { updatedAt: "DESC" },
        });
    }

    // Validar un incidente
    async validarIncidente(id: number, incidenteData: ActualizarIncidenteDto, usuarioId: number): Promise<Incidentes> {
        const incidente = await this.incidentesRepository.findOneBy({ id });

        if (!incidente) throw new NotFoundException("Incidente no encontrado");

        // Solo los verificadores pueden cambiar el estado de verificación
        incidente.verificado = incidenteData.verificado;
        await this.logsService.registrarCambio("incidentes", "editar", incidente, usuarioId);
        return this.incidentesRepository.save(incidente);
    }

    // Editar un incidente existente
    async editarIncidente(id: number, incidenteData: CrearIncidenteDto, usuarioId: number): Promise<Incidentes> {
        const incidente = await this.incidentesRepository.findOneBy({ id });

        if (!incidente) throw new NotFoundException("Incidente no encontrado");

        // Actualizamos los campos del incidente con los nuevos datos
        incidente.tipo = incidenteData.tipo;
        incidente.descripcion = incidenteData.descripcion;
        incidente.ubicacion = incidenteData.ubicacion;
        const carretera = await this.carreterasRepository.findOneBy({ id: incidenteData.carreteraId });
        incidente.carretera = carretera;

        await this.logsService.registrarCambio("incidentes", "editar", incidente, usuarioId);
        return this.incidentesRepository.save(incidente);
    }

    // Eliminar un incidente
    async eliminarIncidente(id: number, usuarioId: number): Promise<void> {
        const incidente = await this.incidentesRepository.findOneBy({ id });
        if (!incidente) throw new NotFoundException("Incidente no encontrado");

        await this.logsService.registrarCambio("incidentes", "eliminar", incidente, usuarioId);
        await this.incidentesRepository.delete(id);
    }
}
