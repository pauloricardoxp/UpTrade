export const imagemSchemas = {
  upload: {
    tags: ["Imagem"],
    summary: "Fazer upload de uma imagem",
    security: [{ bearerAuth: [] }],
    consumes: ["multipart/form-data"],
    response: {
      201: {
        type: "object",
        properties: {
          id_imagem: { type: "number" },
          url_caminho: { type: "string" },
        },
      },
      500: {
        type: "object",
        properties: {
          error: { type: "string" },
        },
      },
    },
  },
};
