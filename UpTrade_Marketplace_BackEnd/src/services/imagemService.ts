import { PrismaClient } from "@prisma/client";

export class imagemServices {
  constructor(private prisma: PrismaClient) {}

  async upload(url_caminho: string) {
    return await this.prisma.imagem.create({
      data: { url_caminho },
    });
  }
}
