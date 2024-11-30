// incidentes.model.ts

import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn } from "typeorm";
import { Carreteras } from "src/carreteras/carreteras.model";

@Entity()
export class Incidentes {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    tipo: string;

    @Column()
    descripcion: string;

    @Column("json")
    ubicacion: { lat: number; lng: number }; // Coordenadas

    @Column({ default: false })
    verificado: boolean;

    @ManyToOne(() => Carreteras, carretera => carretera.id, { onDelete: "CASCADE" })
    @JoinColumn({ name: "carreteraId" })
    carretera: Carreteras;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
