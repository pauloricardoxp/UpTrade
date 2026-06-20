import { PrismaClient } from "@prisma/client";
import { usuarioService } from "../services/usuarioServices.js";
import { FastifyReply, FastifyRequest } from "fastify";
import { myPerfil } from "../types/authType.js";

export class UsuarioController {
  private usuarioService: usuarioService;

  constructor(prisma: PrismaClient) {
    this.usuarioService = new usuarioService(prisma);
  }

  async getPerfil(req: FastifyRequest, res: FastifyReply) {
    const { id } = req.user as { id: number };
    try {
      const perfil = await this.usuarioService.getPerfil(id);
      return res.code(200).send(perfil);
    } catch (err: any) {
      return res.code(500).send({ error: err.message });
    }
  }

  async updatePerfil(req: FastifyRequest, res: FastifyReply) {
    const body = req.body as myPerfil;
    const { id } = req.user as { id: number };

    try {
      const perfil = await this.usuarioService.updatePerfil(id, body);
      return res.code(200).send(perfil);
    } catch (err: any) {
      res.code(500).send({ error: err.message });
    }
  }
  async updateFotoPerfil(req: FastifyRequest, res: FastifyReply) {
    try {
      const arquivo = await req.file();

      if (!arquivo) {
        return res.code(400).send({ error: "Nenhuma imagem foi enviada." });
      }

      const buffer = await arquivo.toBuffer();
      const resultado = await new Promise<any>((resolve, reject) => {
        req.server.cloudinary.uploader
          .upload_stream(
            {
              folder: "marketplace",
              transformation: [{ width: 500, height: 500, crop: "limit" }],
            },
            (error, result) => {
              if (error) reject(error);
              else resolve(result);
            },
          )
          .end(buffer);
      });

      const { id } = req.user as { id: number };

      const usuarioAtualizado = await this.usuarioService.updateFotoPerfil(
        id,
        resultado.secure_url,
      );

      return res.code(200).send({
        message: "Foto de perfil atualizada!",
        url: usuarioAtualizado.foto_perfil,
      });
    } catch (err: any) {
      return res.code(500).send({ error: "Falha no upload: " + err.message });
    }
  }
}
