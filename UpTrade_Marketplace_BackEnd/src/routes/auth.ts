import fastify, { FastifyInstance } from "fastify";
import { AuthController } from "../controller/authController.js";
import { authSchemas } from "../schemas/authSchemas.js";

export async function authRoutes(server: FastifyInstance) {
  const authController = new AuthController(server.prisma);

  server.post(
    "/register",
    { schema: authSchemas.register },
    authController.register.bind(authController),
  );
  server.post(
    "/login",
    { schema: authSchemas.login },
    authController.login.bind(authController),
  );
}
