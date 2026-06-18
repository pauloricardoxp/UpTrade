import { PrismaClient } from "@prisma/client";
import { chatType } from "../types/chatType.js";
import { mensagemType } from "../types/mensagemType.js";

export class chatService {
  constructor(private prisma: PrismaClient) {}

  async create(data: chatType, id_usuario: number) {
    const anuncio = await this.prisma.anuncio.findUnique({
      where: { id_anuncio: data.id_anuncio },
    });

    if (!anuncio) {
      throw new Error("Anúncio não encontrado.");
    }

    if (anuncio.id_usuario === id_usuario) {
      throw new Error("Você não pode iniciar um chat no seu próprio anúncio.");
    }

    if (anuncio.status !== "ATIVO") {
      throw new Error(
        "Não é possivel iniciar um chat em um anúncio inativo ou trocado",
      );
    }

    const chatExistente = await this.prisma.chat.findFirst({
      where: {
        id_anuncio: data.id_anuncio,
        id_usuario: id_usuario,
      },
    });

    if (chatExistente) {
      return chatExistente;
    }

    return await this.prisma.chat.create({
      data: {
        id_anuncio: data.id_anuncio,
        id_usuario: id_usuario,
      },
    });
  }

  async getAll(id_usuario: number) {
    console.log("getAll chamado com id_usuario:", id_usuario);
    const chats = await this.prisma.chat.findMany({
      where: {
        OR: [
          { anuncio: { id_usuario } },
          { id_usuario },
          { mensagens: { some: { id_usuario } } },
        ],
      },
      include: {
        usuario: {
          select: { id_usuario: true, nome: true },
        },
        anuncio: {
          select: {
            titulo: true,
            preco: true,
            imagens: true,
            id_usuario: true,
            usuario: { select: { id_usuario: true, nome: true } },
          },
        },
        mensagens: { orderBy: { data_envio: "desc" }, take: 1 },
      },
    });

    const chatsProcessados = chats.map((chat) => {
      const isVendedor = chat.anuncio.id_usuario === id_usuario;
      const nomeOutroUsuario = isVendedor
        ? chat.usuario?.nome
        : chat.anuncio.usuario?.nome;

      return {
        ...chat,
        usuario: {
          ...chat.usuario,
          nome: nomeOutroUsuario,
        },
      };
    });
    return chatsProcessados;
  }

  async getById(id_chat: number, id_usuario: number) {
    const chat = await this.prisma.chat.findUnique({
      where: { id_chat },
      include: {
        usuario: {
          select: { id_usuario: true, nome: true },
        },
        mensagens: {
          include: { usuario: { select: { id_usuario: true, nome: true } } },
          orderBy: { data_envio: "asc" },
        },
        anuncio: {
          select: {
            titulo: true,
            status: true,
            id_usuario: true,
            usuario: { select: { nome: true } },
          },
        },
      },
    });

    if (!chat) {
      throw new Error("Chat não encontrado.");
    }

    const isParticipante =
      chat.anuncio.id_usuario === id_usuario ||
      chat.id_usuario === id_usuario ||
      chat.mensagens.some((m) => m.id_usuario === id_usuario);

    if (!isParticipante) {
      throw new Error("Você não tem acesso a esse chat.");
    }

    return chat;
  }

  async enviarMensagem(
    data: mensagemType,
    id_chat: number,
    id_usuario: number,
  ) {
    const chatExiste = await this.prisma.chat.findUnique({
      where: {
        id_chat,
      },
    });

    if (!chatExiste) {
      throw new Error("Chat nao encontrado");
    }

    return await this.prisma.mensagem.create({
      data: {
        texto: data.texto,
        id_chat,
        id_usuario,
      },
    });
  }
}
