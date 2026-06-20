import { FastifyReply, FastifyRequest } from "fastify";

import { PrismaClient } from "@prisma/client";
import { authService } from "../services/authService.js";


export class AuthController {
  private authService: authService;

  constructor(prisma: PrismaClient) {
    this.authService = new authService(prisma);
  }

  async register(req: FastifyRequest, res: FastifyReply) {
    const body = req.body as {
      nome: string;
      email: string;
      senha: string;
      cpf: string;
      telefone: string;
    };

    try {
      const usuario = await this.authService.register(body);
      return res.code(201).send(usuario);
    } catch (err: any) {
      return res.code(400).send({ error: err.message });
    }
  }

  async login(req: FastifyRequest, res: FastifyReply) {
    const body = req.body as {
      email: string;
      senha: string;
    };

    try {
      const usuario = await this.authService.login(body);

      const token = req.server.jwt.sign({
        id: usuario.id_usuario,
        email: usuario.email,
        role: usuario.role
      });
      return res.code(200).send({ token });
    } catch (err: any) {
      return res.code(400).send({ error: err.message });
    }
  }
}
