import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { DataSource } from "typeorm";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Generos } from "./generos/generos.model";
import { GenerosController } from "./generos/generos.controller";
import { GenerosService } from "./generos/generos.service";

@Module({
    imports: [
        TypeOrmModule.forRoot({
            type: "mysql",
            host: "localhost",
            port: 3306,
            username: "root",
            password: "",
            database: "Spotify-Indigo",
            entities: [Generos],
            synchronize: false, //solo cuando estamos en desarrollo papu papu
        }),
        TypeOrmModule.forFeature([Generos]),
    ],
    controllers: [AppController, GenerosController],
    providers: [AppService, GenerosService],
})
export class AppModule {
    constructor(private dataSource: DataSource) {}
}
