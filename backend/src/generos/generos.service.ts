import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Generos } from "./generos.model";
import { Repository } from "typeorm";

@Injectable()
export class GenerosService {
    constructor(
        @InjectRepository(Generos)
        private generoRepository: Repository<Generos>,
    ) {}
    findAll(): Promise<Generos[]> {
        return this.generoRepository.find();
    }
    findById(id: number): Promise<Generos | null> {
        return this.generoRepository.findOneBy({ id });
    }
    createGenero(genero: Generos): Promise<Generos> {
        return this.generoRepository.save(genero);
    }
    deleteGenero(genero: Generos): Promise<Generos> {
        return this.generoRepository.remove(genero);
    }
    async updateGenero(genero: Generos): Promise<Generos> {
        await this.generoRepository.update(genero.id.toString(), genero);
        return genero;
    }
}
