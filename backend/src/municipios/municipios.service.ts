import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Municipios } from "./municipios.model";
import { MunicipioDto } from "./dto/municipios.dto";
import { LogsService } from "../logs/logs.service";

@Injectable()
export class MunicipiosService {
    constructor(
        @InjectRepository(Municipios)
        private municipiosRepository: Repository<Municipios>,
        private readonly logsService: LogsService,
    ) {}

    // Crear un nuevo municipio
    async createMunicipio(municipioData: MunicipioDto, usuarioId: number): Promise<Municipios> {
        const municipio = this.municipiosRepository.create(municipioData);
        this.logsService.registrarCambio("municipios", "crear", municipioData, usuarioId);
        return this.municipiosRepository.save(municipio);
    }

    // Obtener todos los municipios
    findAll(): Promise<Municipios[]> {
        return this.municipiosRepository.find();
    }

    // Buscar un municipio por id
    async findById(id: number): Promise<Municipios> {
        const municipio = await this.municipiosRepository.findOneBy({ id });
        if (!municipio) {
            throw new NotFoundException("Municipio no encontrado");
        }
        return municipio;
    }

    // Actualizar municipio
    async updateMunicipio(id: number, municipioData: MunicipioDto, usuarioId: number): Promise<Municipios> {
        const municipio = await this.findById(id);
        if (!municipio) throw new NotFoundException("Municipio no encontrado");

        await this.municipiosRepository.update(id, municipioData);
        this.logsService.registrarCambio("municipios", "editar", municipioData, usuarioId);
        return this.municipiosRepository.findOneBy({ id });
    }

    // Eliminar un municipio
    async deleteMunicipio(id: number, usuarioId: number): Promise<void> {
        const municipio = await this.findById(id);
        if (!municipio) throw new NotFoundException("Municipio no encontrado");

        this.logsService.registrarCambio("municipios", "eliminar", municipio, usuarioId);
        await this.municipiosRepository.delete(id);
    }
}
