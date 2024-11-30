import { Body, Controller, Delete, Get, NotFoundException, Param, Post, Put, UseGuards } from "@nestjs/common";
import { UsuariosService } from "./usuarios.service";
import { Usuarios } from "./usuarios.model";
import { UsuarioDto, UpdateUsuarioDto } from "./dto/usuarios.dto";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";
import { RolesGuard } from "../auth/roles.guard";
import { Roles } from "../auth/roles.decorator";
import * as bcrypt from "bcrypt";

@Controller("usuarios")
export class UsuariosController {
    constructor(private usuariosService: UsuariosService) {}

    // Listar todos los usuarios (Solo administradores)
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles("administrador")
    @Get()
    async list(): Promise<Usuarios[]> {
        //return this.usuariosService.findAll();
        const usuarios = await this.usuariosService.findAll();
        const usuariosSinPassword = usuarios.map(usuario => ({
            ...usuario,
            password: undefined,
        }));

        return usuariosSinPassword;
    }

    // Obtener un usuario por id (Solo administradores o verificadores)
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles("administrador")
    @Get(":id")
    async get(@Param("id") id: number): Promise<Usuarios> {
        const usuario = await this.usuariosService.findById(id);
        if (!usuario) {
            throw new NotFoundException("Usuario no encontrado");
        }
        return usuario;
    }

    // Crear un nuevo usuario (Solo administradores)
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles("administrador")
    @Post()
    async create(@Body() usuarioData: UsuarioDto): Promise<Usuarios> {
        return this.usuariosService.createUsuario(usuarioData);
    }

    // Actualizar un usuario (Solo administradores)
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles("administrador")
    @Put(":id")
    async update(@Param("id") id: number, @Body() usuarioData: UpdateUsuarioDto): Promise<Usuarios> {
        return this.usuariosService.updateUsuario(id, usuarioData);
    }

    // Eliminar un usuario (Solo administradores)
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles("administrador")
    @Delete(":id")
    async delete(@Param("id") id: number): Promise<void> {
        await this.usuariosService.deleteUsuario(id);
    }

    //------------------------------------------------------------------------------------------------
    // Cambiar contraseña (Solo administradores)
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles("administrador")
    @Post(":id/cambiar-contrasena")
    async changePassword(@Param("id") id: number, @Body() passwordData: { password: string }): Promise<Usuarios> {
        const usuario = await this.usuariosService.findById(id);
        if (!usuario) {
            throw new NotFoundException("Usuario no encontrado");
        }
        usuario.password = await bcrypt.hash(passwordData.password, 10);
        await this.usuariosService.updateUsuario(id, usuario);
        return usuario;
    }

    // Iniciar sesión con email y password
    @Post("login")
    async login(@Body() usuarioData: { email: string; password: string }) {
        return this.usuariosService.login(usuarioData.email, usuarioData.password);
    }
}
