import fastify, { FastifyInstance } from "fastify";
import { v2 as cloudinary } from "cloudinary";
import fp from "fastify-plugin"

export async function cloudinaryPlugin(server: FastifyInstance) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });

  server.decorate("cloudinary", cloudinary as any);
}

export default fp(cloudinaryPlugin);
