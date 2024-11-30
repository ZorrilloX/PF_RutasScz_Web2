import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { DataSource } from "typeorm";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UsuariosController } from "./usuarios/usuarios.controller";
import { Usuarios } from "./usuarios/usuarios.model";
import { JwtModule } from "@nestjs/jwt";
import { UsuariosService } from "./usuarios/usuarios.service";
import { AuthModule } from "./auth/auth.module";
import { AuthService } from "./auth/auth.service";
import { MunicipiosController } from "./municipios/municipios.controller";
import { MunicipiosService } from "./municipios/municipios.service";
import { Municipios } from "./municipios/municipios.model";
import { CarreterasController } from "./carreteras/carreteras.controller";
import { CarreterasService } from "./carreteras/carreteras.service";
import { Carreteras } from "./carreteras/carreteras.model";
import { IncidentesService } from "./incidentes/incidentes.service";
import { IncidentesController } from "./incidentes/incidentes.controller";
import { Incidentes } from "./incidentes/incidentes.model";
import { LogsService } from "./logs/logs.service";
import { Logs } from "./logs/logs.model";
import { LogsController } from "./logs/logs.controller";
import { LogsModule } from "./logs/logs.module";
import { ServeStaticModule } from "@nestjs/serve-static";
import { join } from "path";
import { ImagenesService } from "./imagen-service/imagen-service.service";

@Module({
    imports: [
        TypeOrmModule.forRoot({
            type: "mysql",
            host: "localhost",
            port: 3306,
            username: "root",
            password: "",
            database: "rutasscz",
            entities: [Usuarios, Municipios, Carreteras, Incidentes, Logs],
            synchronize: true, //solo cuando estamos en desarrollo papu papu
        }),
        TypeOrmModule.forFeature([Usuarios, Municipios, Carreteras, Incidentes, Logs]),
        JwtModule.register({
            secret: "INDIGO es el mejor <3",
            signOptions: { expiresIn: "1h" },
        }),
        ServeStaticModule.forRoot({
            //config para las imagenes
            rootPath: join(__dirname, "..", "backend", "../uploads"),
            serveRoot: "/imagenes",
            exclude: ["/index.html"],
        }),
        AuthModule,
        LogsModule,
    ],
    controllers: [AppController, UsuariosController, MunicipiosController, CarreterasController, IncidentesController, LogsController],
    providers: [AppService, UsuariosService, AuthService, MunicipiosService, CarreterasService, IncidentesService, LogsService, ImagenesService],
    exports: [AuthService],
})
export class AppModule {
    constructor(private dataSource: DataSource) {}
}
