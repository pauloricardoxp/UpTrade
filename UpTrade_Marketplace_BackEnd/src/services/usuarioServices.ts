import { PrismaClient } from "@prisma/client";
import { myPerfil } from "../types/authType.js";

export class usuarioService {
  constructor(private prisma: PrismaClient) {}

  async getPerfil(id_usuario: number) {
    const perfil = await this.prisma.usuario.findUnique({
      where: {
        id_usuario,
      },
      select: {
        nome: true,
        email: true,
        telefone: true,
        foto_perfil: true,
        data_cadastro: true
      },
    });

    if (!perfil) {
      throw new Error("Perfil nao encontrado");
    }

    const [anunciosAtivos, anunciosInativos, anunciosTrocados] =
      await Promise.all([
        this.prisma.anuncio.count({
          where: { id_usuario, status: "ATIVO" },
        }),
        this.prisma.anuncio.count({
          where: { id_usuario, status: "INATIVO" },
        }),
        this.prisma.anuncio.count({
          where: { id_usuario, status: "TROCADO" },
        }),
      ]);

    return {
      ...perfil,
      anuncios: {
        ativos: anunciosAtivos,
        inativos: anunciosInativos,
        trocados: anunciosTrocados,
      },
    };
  }

  async updatePerfil(id_usuario: number, data: myPerfil) {
    const usuarioExiste = await this.prisma.usuario.findUnique({
      where: { id_usuario },
    });

    if (!usuarioExiste) {
      throw new Error("Usuário não encontrado.");
    }

    if (data.telefone) {
      const telefoneEmUso = await this.prisma.usuario.findFirst({
        where: {
          telefone: data.telefone,
          id_usuario: { not: id_usuario },
        },
      });

      if (telefoneEmUso) {
        throw new Error("Este telefone já está sendo usado por outro usuário.");
      }
    }

    const dataToUpdate: any = {};
    if (data.nome !== undefined && data.nome !== "")
      dataToUpdate.nome = data.nome;
    if (data.telefone !== undefined && data.telefone !== "")
      dataToUpdate.telefone = data.telefone;
    if (data.foto_perfil !== undefined && data.foto_perfil !== "")
      dataToUpdate.foto_perfil = data.foto_perfil;

    return await this.prisma.usuario.update({
      where: { id_usuario },
      data: dataToUpdate,
      select: {
        nome: true,
        telefone: true,
        foto_perfil: true,
      },
    });
  }

  async updateFotoPerfil(id_usuario: number, url_imagem: string) {
    return await this.prisma.usuario.update({
      where: {
        id_usuario,
      },
      data: {
        foto_perfil: url_imagem,
      },
    });
  }
}
