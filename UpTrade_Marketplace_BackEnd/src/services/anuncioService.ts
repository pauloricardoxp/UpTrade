import {
  Categoria,
  Condicao,
  PrismaClient,
  StatusAnuncio,
} from "@prisma/client";
import { anuncioType } from "../types/anuncioType.js";

export class anuncioService {
  constructor(private prisma: PrismaClient) {}

  async getAll(filtros: {
    status?: string;
    categoria?: string;
    condicao?: string;
  }) {
    return await this.prisma.anuncio.findMany({
      where: {
        status: filtros.status ? (filtros.status as StatusAnuncio) : "ATIVO",
        categoria: filtros.categoria
          ? (filtros.categoria as Categoria)
          : undefined,
        condicao: filtros.condicao ? (filtros.condicao as Condicao) : undefined,
      },
      include: {
        imagens: {
          select: { id_imagem: true, url_caminho: true },
        },
        usuario: {
          select: { nome: true, foto_perfil: true },
        },
      },
    });
  }

  async getById(id_anuncio: number) {
    const anuncio = await this.prisma.anuncio.findUnique({
      where: { id_anuncio },
      include: {
        imagens: {
          select: { id_imagem: true, url_caminho: true },
        },
        usuario: {
          select: { nome: true, foto_perfil: true },
        },
      },
    });

    if (!anuncio) {
      throw new Error("Anúncio nao encontrado");
    }

    return anuncio;
  }

  async create(data: anuncioType, id_usuario: number) {
    const { id_imagens, ...anuncioData } = data as any;

    if (id_imagens && Array.isArray(id_imagens)) {
      const uniqueIds = new Set(id_imagens);
      if (uniqueIds.size !== id_imagens.length) {
        throw new Error(
          "Não é permitido enviar a mesma imagem múltiplas vezes",
        );
      }

      if (id_imagens.length > 5) {
        throw new Error("Máximo de 5 imagens permitido");
      }

      const imagens = await this.prisma.imagem.findMany({
        where: { id_imagem: { in: id_imagens } },
      });

      if (imagens.length !== id_imagens.length) {
        throw new Error("Uma ou mais imagens não foram encontradas");
      }
    }

    const anuncio = await this.prisma.anuncio.create({
      data: {
        ...anuncioData,
        id_usuario,
      },
    });

    if (id_imagens && Array.isArray(id_imagens) && id_imagens.length > 0) {
      await Promise.all(
        id_imagens.map((id_imagem) =>
          this.prisma.imagem.update({
            where: { id_imagem },
            data: { id_anuncio: anuncio.id_anuncio },
          }),
        ),
      );
    }

    return anuncio;
  }

  async update(data: anuncioType, id_anuncio: number, id_usuario: number) {
    const anuncio = await this.prisma.anuncio.findUnique({
      where: { id_anuncio },
    });

    if (!anuncio) {
      throw new Error("Anúncio não encontrado.");
    }

    if (anuncio.id_usuario !== id_usuario) {
      throw new Error("Você não tem permissão para editar este anúncio.");
    }

    if(anuncio.status !== "ATIVO"){
      throw new Error("Você não pode editar um anúncio que esteja Inativo ou Trocado")
    }

    const { id_imagens, ...anuncioData } = data as any;

    if (id_imagens && Array.isArray(id_imagens)) {
      const uniqueIds = new Set(id_imagens);
      if (uniqueIds.size !== id_imagens.length) {
        throw new Error(
          "Não é permitido enviar a mesma imagem múltiplas vezes",
        );
      }

      if (id_imagens.length > 5) {
        throw new Error("Máximo de 5 imagens permitido");
      }

      const imagens = await this.prisma.imagem.findMany({
        where: { id_imagem: { in: id_imagens } },
      });

      if (imagens.length !== id_imagens.length) {
        throw new Error("Uma ou mais imagens não foram encontradas");
      }

      // Desassocia as imagens antigas
      await this.prisma.imagem.updateMany({
        where: { id_anuncio },
        data: { id_anuncio: null },
      });

      // Associa as novas imagens
      await Promise.all(
        id_imagens.map((id_imagem) =>
          this.prisma.imagem.update({
            where: { id_imagem },
            data: { id_anuncio },
          }),
        ),
      );
    }

    return await this.prisma.anuncio.update({
      where: { id_anuncio },
      data: anuncioData,
    });
  }

  async delete(id_anuncio: number, id_usuario: number) {
    const anuncio = await this.prisma.anuncio.findUnique({
      where: { id_anuncio },
    });

    if (!anuncio) {
      throw new Error("Anúncio nao encontrado");
    }

    if (anuncio.id_usuario !== id_usuario) {
      throw new Error("Você não tem permissão para deletar este anúncio.");
    }

    return await this.prisma.anuncio.delete({
      where: { id_anuncio },
    });
  }

  async getAllMy(id_usuario: number) {
    const anuncio = await this.prisma.anuncio.findMany({
      where: { id_usuario },
      include: {
        imagens: {
          select: { id_imagem: true, url_caminho: true },
        },
      },
    });

    return anuncio;
  }
}
