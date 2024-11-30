import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from "typeorm";

@Entity()
export class Municipios {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    nombre: string;

    @Column("decimal", { precision: 10, scale: 8 })
    lat: number;

    @Column("decimal", { precision: 11, scale: 8 })
    lng: number;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
