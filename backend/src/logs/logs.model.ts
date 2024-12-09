import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from "typeorm";

@Entity("logs")
export class Logs {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    tabla: string;

    @Column()
    accion: string;

    @Column("json")
    detalle: any;

    @Column()
    usuarioId: number;

    @CreateDateColumn()
    createdAt: Date;
}
