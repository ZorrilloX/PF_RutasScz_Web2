import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Generos {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    nombre: string;
}
