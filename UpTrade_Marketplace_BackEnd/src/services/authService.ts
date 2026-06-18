import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import { authTypes, loginType } from "../types/authType.js";

export class authService {
  constructor(private prisma: PrismaClient) {}

  async register(data: authTypes) {
    const senhaHash = await bcrypt.hash(data.senha, 10);

    return await this.prisma.usuario.create({
      data: {
        ...data,
        senha: senhaHash,
      },
      select: {
        id_usuario: true,
        nome: true,
        email: true,
        cpf: true,
        telefone: true,
        data_cadastro: true,
      },
    });
  }

  async login(data: loginType) {
    const usuario = await this.prisma.usuario.findUnique({
      where: { email: data.email },
    });

    if (!usuario) {
      throw new Error("Email ou senha inválidos");
    }

    const senhaValidade = await bcrypt.compare(data.senha, usuario.senha);

    if (!senhaValidade) {
      throw new Error("Email ou senha inválidos");
    }

    return usuario;
  }
}
