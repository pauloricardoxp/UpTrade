import { PrismaClient } from "@prisma/client";
import { anuncioService } from "../services/anuncioService.js";
import { FastifyReply, FastifyRequest } from "fastify";
import { anuncioType } from "../types/anuncioType.js";

export class AnuncioController {
  private anuncioService: anuncioService;

  constructor(prisma: PrismaClient) {
    this.anuncioService = new anuncioService(prisma);
  }

  async getAll(req: FastifyRequest, res: FastifyReply) {
    const { status, categoria, condicao } = req.query as {
      status?: string;
      categoria?: string;
      condicao?: string;
    };
    try {
      const anuncio = await this.anuncioService.getAll({
        status,
        categoria,
        condicao,
      });
      return res.code(200).send(anuncio);
    } catch (err: any) {
      return res.code(500).send({ error: err.message });
    }
  }

  async getById(req: FastifyRequest, res: FastifyReply) {
    const { id_anuncio } = req.params as { id_anuncio: number };

    try {
      const anuncio = await this.anuncioService.getById(Number(id_anuncio));
      return res.code(200).send(anuncio);
    } catch (err: any) {
      return res.code(404).send({ error: err.message });
    }
  }

  async create(req: FastifyRequest, res: FastifyReply) {
    const body = req.body as anuncioType;
    const { id } = req.user as { id: number };

    try {
      const anuncio = await this.anuncioService.create(body, id);
      return res.code(201).send(anuncio);
    } catch (err: any) {
      if (
        err.message.includes("mesma imagem múltiplas vezes") ||
        err.message.includes("Máximo de 5") ||
        err.message.includes("não foram encontradas")
      ) {
        return res.code(422).send({ error: err.message });
      }
      return res.code(400).send({ error: err.message });
    }
  }

  async update(req: FastifyRequest, res: FastifyReply) {
    const { id_anuncio } = req.params as { id_anuncio: number };
    const body = req.body as anuncioType;
    const { id } = req.user as { id: number };

    try {
      const anuncio = await this.anuncioService.update(
        body,
        Number(id_anuncio),
        id,
      );
      return res.code(200).send(anuncio);
    } catch (err: any) {
      if (err.message.includes("não encontrado")) {
        return res.code(404).send({ error: err.message });
      } else if (err.message.includes("permissão")) {
        return res.code(403).send({ error: err.message });
      } else if (err.message.includes("não pode editar")) {
        return res.code(422).send({ error: err.message });
      }
      return res.code(400).send({ error: err.message });
    }
  }

  async delete(req: FastifyRequest, res: FastifyReply) {
    const { id_anuncio } = req.params as { id_anuncio: number };
    const { id } = req.user as { id: number };

    try {
      await this.anuncioService.delete(Number(id_anuncio), id);
      return res.code(204).send();
    } catch (err: any) {
      if (err.message.includes("nao encontrado")) {
        return res.code(404).send({ error: err.message });
      } else if (err.message.includes("permissão")) {
        return res.code(403).send({ error: err.message });
      } else if (err.message.includes("não pode deletar")) {
        return res.code(422).send({ error: err.message });
      }
      return res.code(400).send({ error: err.message });
    }
  }

  async getAllMy(req: FastifyRequest, res: FastifyReply) {
    const { id } = req.user as { id: number };
    try {
      const anuncio = await this.anuncioService.getAllMy(id);
      return res.code(200).send(anuncio);
    } catch (err: any) {
      return res.code(500).send({ error: err.message });
    }
  }
}
