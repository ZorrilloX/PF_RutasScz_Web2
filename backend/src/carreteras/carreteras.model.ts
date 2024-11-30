import { Column, Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn } from "typeorm";
import { Municipios } from "../municipios/municipios.model";

@Entity()
export class Carreteras {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    nombre: string;

    @ManyToOne(() => Municipios)
    @JoinColumn({ name: "municipioOrigenId" }) // Define el nombre de la columna de la clave foránea
    municipioOrigen: Municipios;

    @ManyToOne(() => Municipios)
    @JoinColumn({ name: "municipioDestinoId" }) // Define el nombre de la columna de la clave foránea
    municipioDestino: Municipios;

    @Column()
    estado: string; // "libre", "bloqueada"

    @Column({ nullable: true })
    razonBloqueo: string;

    @Column("simple-json", { nullable: true })
    puntos: { lat: number; lng: number }[]; // Puntos que forman la ruta

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
