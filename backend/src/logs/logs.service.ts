import { Injectable, InternalServerErrorException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Logs } from "./logs.model";

@Injectable()
export class LogsService {
    constructor(
        @InjectRepository(Logs)
        private readonly logsRepository: Repository<Logs>,
    ) {}

    async registrarCambio(tabla: string, accion: string, detalle: any, usuarioId: number) {
        try {
            // Creamos el log
            const log = this.logsRepository.create({
                tabla,
                accion,
                detalle,
                usuarioId,
            });
            console.log(log);
            // Intentamos guardar el log
            await this.logsRepository.save(log);
        } catch (error) {
            // Si ocurre un error, lanzamos una excepción interna con un mensaje adecuado
            throw new InternalServerErrorException("Error al registrar el cambio en los logs", error.message);
        }
    }

    async obtenerTodos(): Promise<Logs[]> {
        return this.logsRepository.find({ order: { createdAt: "DESC" } });
    }
}
