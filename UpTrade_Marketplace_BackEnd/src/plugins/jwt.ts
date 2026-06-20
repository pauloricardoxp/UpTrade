import fp from "fastify-plugin";
import fastifyJwt from "@fastify/jwt";
import { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";
import { request } from "node:http";

async function jwtPlugin(fastify: FastifyInstance) {
  fastify.register(fastifyJwt, {
    secret: process.env.JWT_SECRET ?? "troque_em_producao",
    sign: {
      expiresIn: "1h"
    }
  });

  fastify.decorate(
    "authenticate",
    async (request: FastifyRequest, reply: FastifyReply) => {
      try {
        await request.jwtVerify();
      } catch (err) {
        reply.status(401).send({ error: "Token inválido ou expirado." });
      }
    },
  );
  fastify.decorate(
    "isAdmin",
    async (request: FastifyRequest, reply: FastifyReply) => {
      try {
        await request.jwtVerify();
        const user = request.user as {
          id: number;
          email: string;
          role: string;
        };

        if (user.role !== "ADMIN") {
          return reply.code(403).send({ error: "Acesso negado." });
        }
      } catch (err) {
        reply.code(401).send({ error: "Token inválido ou expirado." });
      }
    },
  );
}

export default fp(jwtPlugin);
