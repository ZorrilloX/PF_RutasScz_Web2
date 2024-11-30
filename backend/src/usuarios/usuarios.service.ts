import { Injectable, NotFoundException, UnauthorizedException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import * as bcrypt from "bcrypt";
import { Usuarios } from "./usuarios.model";
import { UsuarioDto, UpdateUsuarioDto } from "./dto/usuarios.dto";
import { JwtService } from "@nestjs/jwt";

@Injectable()
export class UsuariosService {
    constructor(
        @InjectRepository(Usuarios)
        private usuariosRepository: Repository<Usuarios>,
        private jwtService: JwtService,
    ) {}

    // Crear un nuevo usuario
    async createUsuario(usuarioData: UsuarioDto): Promise<Usuarios> {
        const hashedPassword = await bcrypt.hash(usuarioData.password, 10);
        const usuario = this.usuariosRepository.create({
            ...usuarioData,
            password: hashedPassword,
        });
        return this.usuariosRepository.save(usuario);
    }

    // Obtener todos los usuarios
    findAll(): Promise<Usuarios[]> {
        return this.usuariosRepository.find();
    }

    // Buscar un usuario por id
    findById(id: number): Promise<Usuarios | null> {
        return this.usuariosRepository.findOneBy({ id });
    }

    // Actualizar usuario
    async updateUsuario(id: number, usuarioData: UpdateUsuarioDto): Promise<Usuarios> {
        const usuarioDB = await this.findById(id);
        if (!usuarioDB) {
            throw new NotFoundException("Usuario no encontrado");
        }

        // Si hay una nueva contraseña, la encriptamos
        if (usuarioData.password) {
            usuarioData.password = await bcrypt.hash(usuarioData.password, 10);
        }

        await this.usuariosRepository.update(id, usuarioData);
        return this.usuariosRepository.findOneBy({ id });
    }

    // Eliminar un usuario
    async deleteUsuario(id: number): Promise<void> {
        const usuarioDB = await this.findById(id);
        if (!usuarioDB) {
            throw new NotFoundException("Usuario no encontrado");
        }
        await this.usuariosRepository.delete(id);
    }

    // Validar si un usuario es administrador
    async isAdmin(id: number): Promise<boolean> {
        const usuario = await this.findById(id);
        return usuario?.rol === "administrador";
    }

    // Validar si un usuario es verificador
    async isVerificador(id: number): Promise<boolean> {
        const usuario = await this.findById(id);
        return usuario?.rol === "verificador";
    }
    async checkRole(id: number, requiredRole: string): Promise<boolean> {
        const usuario = await this.findById(id);
        if (!usuario) {
            throw new NotFoundException("Usuario no encontrado");
        }
        return usuario.rol === requiredRole;
    }

    // Iniciar sesión y obtener el token
    async login(email: string, password: string) {
        // Buscar el usuario por su email
        const usuario = await this.usuariosRepository.findOne({
            where: { email: email },
        });

        if (!usuario) {
            throw new UnauthorizedException("Usuario no encontrado");
        }

        // Validar la contraseña
        const passwordMatches = await bcrypt.compare(password, usuario.password);
        if (!passwordMatches) {
            throw new UnauthorizedException("Contraseña incorrecta");
        }

        // Generar el JWT
        const payload = { email: usuario.email, sub: usuario.id, rol: usuario.rol };
        const token = this.jwtService.sign(payload);
        return { token };
    }
}
