import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Logs } from "./logs.model";
import { LogsService } from "./logs.service";

@Module({
    imports: [TypeOrmModule.forFeature([Logs])],
    providers: [LogsService],
    exports: [LogsService], // Exportamos para usar en otros módulos
})
export class LogsModule {}
