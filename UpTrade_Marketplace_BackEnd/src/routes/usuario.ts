import { FastifyInstance } from "fastify";
import { UsuarioController } from "../controller/usuarioController.js";
import { usuarioSchemas } from "../schemas/usuarioSchemas.js";

export async function usuarioRoutes(server: FastifyInstance) {
  const usuariocontroller = new UsuarioController(server.prisma);

  server.get(
    "/perfil",
    { schema: usuarioSchemas.getPerfil, preHandler: [server.authenticate] },
    usuariocontroller.getPerfil.bind(usuariocontroller),
  );

  server.patch(
    "/perfil/:id",
    { schema: usuarioSchemas.updatePerfil, preHandler: [server.authenticate] },
    usuariocontroller.updatePerfil.bind(usuariocontroller),
  );

  server.patch(
    "/perfil/foto/:id",
    {
      schema: usuarioSchemas.updateFotoPerfil,
      preHandler: [server.authenticate],
    },
    usuariocontroller.updateFotoPerfil.bind(usuariocontroller),
  );
}
