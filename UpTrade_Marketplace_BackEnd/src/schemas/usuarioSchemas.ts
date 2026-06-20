export const usuarioSchemas = {
  getPerfil: {
    tags: ["Usuario"],
    summary: "Listar dados do usuario",
    security: [{ bearerAuth: [] }],
    response: {
      200: {
        type: "object",
        properties: {
          nome: { type: "string" },
          email: { type: "string" },
          telefone: { type: "string" },
          foto_perfil: { type: "string" },
          data_cadastro: { type: "string" },
          anuncios: {
            type: "object",
            properties: {
              ativos: { type: "number" },
              inativos: { type: "number" },
              trocados: { type: "number" },
            },
          },
        },
      },
    },
  },
  updatePerfil: {
    tags: ["Usuario"],
    summary: "Atualizar dados do perfil",
    security: [{ bearerAuth: [] }],
    params: {
      type: "object",
      properties: {
        id: { type: "number" },
      },
    },
    body: {
      type: "object",
      properties: {
        nome: { type: "string" },
        telefone: { type: "string" },
        foto_perfil: { type: "string" },
      },
    },
    response: {
      200: {
        type: "object",
        properties: {
          nome: { type: "string" },
          email: { type: "string" },
          telefone: { type: "string" },
          foto_perfil: { type: "string" },
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
  updateFotoPerfil: {
    tags: ["Usuario"],
    summary: "Atualizar foto de perfil",
    security: [{ bearerAuth: [] }],
    consumes: ["multipart/form-data"],
    params: {
      type: "object",
      properties: {
        id: { type: "number" },
      },
    },
    response: {
      200: {
        type: "object",
        properties: {
          message: { type: "string" },
          url: { type: "string" },
        },
      },
      400: {
        type: "object",
        properties: {
          error: { type: "string" },
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
