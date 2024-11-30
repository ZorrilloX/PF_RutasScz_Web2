import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Carreteras } from "./carreteras.model";
import { Municipios } from "src/municipios/municipios.model";
import { CarreteraDto, UpdateCarreteraDto } from "./dto/carreteras.dto";
import { LogsService } from "../logs/logs.service";

@Injectable()
export class CarreterasService {
    constructor(
        @InjectRepository(Carreteras)
        private carreterasRepository: Repository<Carreteras>,
        private readonly logsService: LogsService,
        @InjectRepository(Municipios)
        private readonly municipiosRepository: Repository<Municipios>,
    ) {}

    // Crear una nueva carretera
    async createCarretera(carreteraData: CarreteraDto, usuarioId: number): Promise<Carreteras> {
        const municipioOrigen = await this.municipiosRepository.findOneBy({ id: carreteraData.municipioOrigen });
        const municipioDestino = await this.municipiosRepository.findOneBy({ id: carreteraData.municipioDestino });

        if (!municipioOrigen || !municipioDestino) throw new NotFoundException("Municipios no encontrados");

        const carretera = this.carreterasRepository.create({
            nombre: carreteraData.nombre,
            municipioOrigen,
            municipioDestino,
            estado: carreteraData.estado,
            razonBloqueo: carreteraData.razonBloqueo,
            puntos: carreteraData.puntos,
        });
        // Registrar el log
        await this.logsService.registrarCambio("carreteras", "crear", carretera, usuarioId);

        return this.carreterasRepository.save(carretera);
    }

    // Obtener todas las carreteras
    findAll(): Promise<Carreteras[]> {
        return this.carreterasRepository.find({
            relations: ["municipioOrigen", "municipioDestino"],
        });
    }

    // Buscar una carretera por id
    async findById(id: number): Promise<Carreteras> {
        const carretera = await this.carreterasRepository.findOneBy({ id });
        if (!carretera) throw new NotFoundException("Carretera no encontrada");
        return carretera;
    }

    // Actualizar carretera
    async updateCarretera(id: number, carreteraData: UpdateCarreteraDto, usuarioId: number): Promise<Carreteras> {
        const carretera = await this.findById(id);
        if (!carretera) throw new NotFoundException("Carretera no encontrada");

        // Actualizar los valores de la carretera
        if (carreteraData.municipioOrigen) {
            const municipioOrigen = await this.municipiosRepository.findOneBy({ id: carreteraData.municipioOrigen });
            if (!municipioOrigen) throw new NotFoundException("Municipio origen no encontrado");
            carretera.municipioOrigen = municipioOrigen;
        }

        if (carreteraData.municipioDestino) {
            const municipioDestino = await this.municipiosRepository.findOneBy({ id: carreteraData.municipioDestino });
            if (!municipioDestino) throw new NotFoundException("Municipio destino no encontrado");
            carretera.municipioDestino = municipioDestino;
        }

        // Realizar la actualización de los otros campos de la carretera
        if (carreteraData.nombre) carretera.nombre = carreteraData.nombre;
        if (carreteraData.estado) carretera.estado = carreteraData.estado;
        if (carreteraData.razonBloqueo) carretera.razonBloqueo = carreteraData.razonBloqueo;
        if (carreteraData.puntos) carretera.puntos = carreteraData.puntos;

        await this.logsService.registrarCambio("carreteras", "editar", carretera, usuarioId);
        return this.carreterasRepository.save(carretera);
    }

    // Eliminar carretera
    async deleteCarretera(id: number, usuarioId: number): Promise<void> {
        const carreteraDB = await this.findById(id);
        if (!carreteraDB) {
            throw new NotFoundException("Carretera no encontrada");
        }
        await this.logsService.registrarCambio("carreteras", "eliminar", carreteraDB, usuarioId);
        await this.carreterasRepository.delete(id);
    }
}
