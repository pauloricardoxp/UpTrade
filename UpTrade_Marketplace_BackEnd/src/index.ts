import Fastify from "fastify";
import prismaPlugin from "./plugins/prisma.js";
import jwtPlugin from "./plugins/jwt.js";
import { authRoutes } from "./routes/auth.js";
import swagger from "@fastify/swagger";
import scalarPlugin from "@scalar/fastify-api-reference";
import { anuncioRoutes } from "./routes/anuncio.js";
import { chatRoutes } from "./routes/chat.js";
import { cloudinaryPlugin } from "./plugins/cloudinary.js";
import fastifyMultipart from "@fastify/multipart";
import { imagemRoutes } from "./routes/imagem.js";
import fastifyCors from "@fastify/cors";
import { usuarioRoutes } from "./routes/usuario.js";
import rateLimit from "./plugins/rateLimit.js";

const server = Fastify({
  logger: true,
});

await server.register(swagger, {
  openapi: {
    info: {
      title: "UpTrade Marketplace API",
      description: "API do marketplace de trocas",
      version: "1.0.0",
    },
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
  },
});

await server.register(scalarPlugin, {
  routePrefix: "/docs",
});

server.register(prismaPlugin);
await server.register(rateLimit)
server.register(jwtPlugin);
server.register(authRoutes, { prefix: "/auth" });
server.register(anuncioRoutes, { prefix: "/anuncios" });
server.register(chatRoutes, { prefix: "/chats" });
server.register(cloudinaryPlugin);
server.register(fastifyMultipart, {
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
});
server.register(imagemRoutes, { prefix: "/upload" });
server.register(usuarioRoutes, { prefix: "/usuarios" });

server.register(fastifyCors, {
  origin: process.env.FRONTEND_URL,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
  credentials: true,
  optionsSuccessStatus: 200,
});

const start = async () => {
  try {
    await server.listen({ port: Number(process.env.PORT), host: "0.0.0.0" });
    console.log("Servidor rodando em http://localhost:8080");
  } catch (err) {
    server.log.error(err);
    process.exit(1);
  }
};

start();
