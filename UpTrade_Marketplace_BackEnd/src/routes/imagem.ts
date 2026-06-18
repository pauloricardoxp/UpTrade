import { FastifyInstance } from "fastify";
import { ImagemController } from "../controller/imagemController.js";
import { imagemSchemas } from "../schemas/imagemSchemas.js";

export async function imagemRoutes(server: FastifyInstance) {
  const imagemController = new ImagemController(server.prisma);

  server.post(
    "/",
    { schema: imagemSchemas.upload, preHandler: [server.authenticate] },
    imagemController.upload.bind(imagemController),
  );
}
