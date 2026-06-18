import { FastifyInstance } from "fastify";
import { ChatController } from "../controller/chatController.js";
import { chatSchemas } from "../schemas/chatSchemas.js";

export async function chatRoutes(server: FastifyInstance) {
  const chatController = new ChatController(server.prisma);

  server.post(
    "/",
    { schema: chatSchemas.create, preHandler: [server.authenticate] },
    chatController.create.bind(chatController),
  );

  server.get(
    "/",
    { schema: chatSchemas.getAll, preHandler: [server.authenticate] },
    chatController.getAll.bind(chatController),
  );
  server.get(
    "/:id_chat",
    { schema: chatSchemas.getById, preHandler: [server.authenticate] },
    chatController.getById.bind(chatController),
  );

  server.post(
    "/:id_chat/mensagem",
    { schema: chatSchemas.enviarMensagem, preHandler: [server.authenticate] },
    chatController.enviarMensagem.bind(chatController),
  );
}
