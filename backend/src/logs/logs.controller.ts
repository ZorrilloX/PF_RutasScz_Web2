// logs.controller.ts
import { Controller, Get, UseGuards } from "@nestjs/common";
import { LogsService } from "./logs.service";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";
import { RolesGuard } from "../auth/roles.guard";
import { Roles } from "../auth/roles.decorator";

@Controller("logs")
export class LogsController {
    constructor(private readonly logsService: LogsService) {}

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles("administrador")
    @Get()
    async obtenerLogs() {
        return this.logsService.obtenerTodos();
    }
}
