import { PrismaClient } from "@prisma/client";
import { imagemServices } from "../services/imagemService.js";
import { FastifyReply, FastifyRequest } from "fastify";
import { error } from "node:console";

export class ImagemController {
  private imagemServices: imagemServices;

  constructor(prisma: PrismaClient) {
    this.imagemServices = new imagemServices(prisma);
  }

  async upload(req: FastifyRequest, res: FastifyReply) {
    try {
      const arquivo = await req.file();
      const buffer = await arquivo?.toBuffer();

      const resultado = await new Promise<any>((resolve, reject) => {
        req.server.cloudinary.uploader
          .upload_stream({ folder: "marketplace" }, (error, result) => {
            if (error) reject(error);
            else resolve(result);
          })
          .end(buffer);
      });

      const imagem = await this.imagemServices.upload(resultado.secure_url);
      return res.code(201).send(imagem);
    } catch (err: any) {
      return res.code(500).send({ error: err.message });
    }
  }
}
