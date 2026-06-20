import fp from "fastify-plugin";
import rateLimit from "@fastify/rate-limit";
import { FastifyInstance } from "fastify";

async function rateLimitPlugin(server: FastifyInstance) {
  await server.register(rateLimit, {
    max: 100,
    timeWindow: "15 seconds", 
    redis: undefined, 
    skipOnError: false,
  });
}

export default fp(rateLimitPlugin);
