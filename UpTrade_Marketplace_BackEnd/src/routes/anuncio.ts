import { FastifyInstance } from "fastify";
import { AnuncioController } from "../controller/anuncioController.js";
import { anuncioSchemas } from "../schemas/anuncioSchemas.js";

export async function anuncioRoutes(server: FastifyInstance) {
  const anuncioController = new AnuncioController(server.prisma);

  server.get(
    "/",
    { schema: anuncioSchemas.getAll },
    anuncioController.getAll.bind(anuncioController),
  );
  server.get(
    "/:id_anuncio",
    { schema: anuncioSchemas.getById },
    anuncioController.getById.bind(anuncioController),
  );

  server.post(
    "/",
    { schema: anuncioSchemas.create, preHandler: [server.authenticate] },
    anuncioController.create.bind(anuncioController),
  );
  server.patch(
    "/:id_anuncio",
    { schema: anuncioSchemas.update, preHandler: [server.authenticate] },
    anuncioController.update.bind(anuncioController),
  );
  server.delete(
    "/:id_anuncio",
    { schema: anuncioSchemas.delete, preHandler: [server.authenticate] },
    anuncioController.delete.bind(anuncioController),
  );
  server.get(
    "/meus",
    { schema: anuncioSchemas.getAllMy, preHandler: [server.authenticate] },
    anuncioController.getAllMy.bind(anuncioController),
  );
}
