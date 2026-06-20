import { PrismaClient } from "@prisma/client";
import { chatService } from "../services/chatServices.js";
import { FastifyReply, FastifyRequest } from "fastify";
import { chatType } from "../types/chatType.js";
import { error } from "node:console";
import { mensagemType } from "../types/mensagemType.js";

export class ChatController {
  private chatService: chatService;

  constructor(prisma: PrismaClient) {
    this.chatService = new chatService(prisma);
  }

  async create(req: FastifyRequest, res: FastifyReply) {
    const body = req.body as chatType;
    const { id } = req.user as { id: number };

    try {
      const chat = await this.chatService.create(body, id);
      return res.code(201).send(chat);
    } catch (err: any) {
      return res.code(500).send({ error: err.message });
    }
  }

  async getAll(req: FastifyRequest, res: FastifyReply) {
    const { id } = req.user as { id: number };

    try {
      const chat = await this.chatService.getAll(id);
      return res.code(200).send(chat);
    } catch (err: any) {
      return res.code(500).send({ error: err.message });
    }
  }

  async getById(req: FastifyRequest, res: FastifyReply) {
    const { id_chat } = req.params as { id_chat: number };
    const { id } = req.user as { id: number };
    try {
      const chat = await this.chatService.getById(Number(id_chat), id);
      return res.code(200).send(chat);
    } catch (err: any) {
      return res.code(500).send({ error: err.message });
    }
  }

  async enviarMensagem(req: FastifyRequest, res: FastifyReply) {
    const texto = req.body as mensagemType;
    const { id_chat } = req.params as { id_chat: number };
    const { id } = req.user as { id: number };

    try {
      const mensagem = await this.chatService.enviarMensagem(
        texto,
        Number(id_chat),
        id,
      );
      return res.code(201).send(mensagem);
    } catch (err: any) {
      return res.code(500).send({ error: err.message });
    }
  }
}
