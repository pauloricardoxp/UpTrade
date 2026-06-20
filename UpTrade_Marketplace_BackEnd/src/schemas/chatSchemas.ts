export const chatSchemas = {
  getAll: {
    tags: ["Chat"],
    summary: "Listar todos os chats",
    security: [{ bearerAuth: [] }],
    response: {
      200: {
        type: "array",
        items: {
          type: "object",
          properties: {
            id_chat: { type: "number" },
            data_criacao: { type: "string" },
            id_anuncio: { type: "number" },
            id_usuario: { type: "number" },
            usuario: {
              type: "object",
              nullable: true,
              properties: {
                id_usuario: { type: "number" },
                nome: { type: "string" },
              },
            },
            anuncio: {
              type: "object",
              properties: {
                titulo: { type: "string" },
                id_usuario: { type: "number" },
                preco: { type: "string" },
                imagem: {
                  type: "object",
                  nullable: true,
                  properties: {
                    url_caminho: { type: "string" },
                  },
                },
                usuario: {
                  type: "object",
                  nullable: true,
                  properties: {
                    nome: { type: "string" },
                  },
                },
              },
            },
            mensagens: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  id_mensagem: { type: "number" },
                  texto: { type: "string" },
                  data_envio: { type: "string" },
                  lida: { type: "boolean" },
                  id_usuario: { type: "number" },
                  id_chat: { type: "number" },
                  usuario: {
                    type: "object",
                    nullable: true,
                    properties: {
                      id_usuario: { type: "number" },
                      nome: { type: "string" },
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
  },
  create: {
    tags: ["Chat"],
    summary: "Criar um chat a partir do anúncio",
    security: [{ bearerAuth: [] }],
    body: {
      type: "object",
      required: ["id_anuncio"],
      properties: {
        id_anuncio: { type: "number" },
      },
    },
    response: {
      201: {
        type: "object",
        properties: {
          id_chat: { type: "number" },
          data_criacao: { type: "string" },
          id_anuncio: { type: "number" },
          id_usuario: { type: "number" },
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
  getById: {
    tags: ["Chat"],
    summary: "Buscar chat por id",
    security: [{ bearerAuth: [] }],
    params: {
      type: "object",
      properties: {
        id_chat: { type: "number" },
      },
    },
    response: {
      200: {
        type: "object",
        properties: {
          id_chat: { type: "number" },
          data_criacao: { type: "string" },
          id_anuncio: { type: "number" },
          id_usuario: { type: "number" },
          anuncio: {
            type: "object",
            properties: {
              titulo: { type: "string" },
              status: { type: "string" },
              id_usuario: { type: "number" },
            },
          },
          mensagens: {
            type: "array",
            items: {
              type: "object",
              properties: {
                id_mensagem: { type: "number" },
                texto: { type: "string" },
                data_envio: { type: "string" },
                lida: { type: "boolean" },
                id_usuario: { type: "number" },
                id_chat: { type: "number" },
                usuario: {
                  type: "object",
                  nullable: true,
                  properties: {
                    id_usuario: { type: "number" },
                    nome: { type: "string" },
                  },
                },
              },
            },
          },
        },
      },
    },
  },
  enviarMensagem: {
    tags: ["Chat"],
    summary: "Enviar mensagem no chat",
    security: [{ bearerAuth: [] }],
    params: {
      type: "object",
      properties: {
        id_chat: { type: "number" },
      },
    },
    body: {
      type: "object",
      required: ["texto"],
      properties: {
        texto: { type: "string" },
      },
    },
    response: {
      201: {
        type: "object",
        properties: {
          id_mensagem: { type: "number" },
          texto: { type: "string" },
          data_envio: { type: "string" },
          lida: { type: "boolean" },
          id_usuario: { type: "number" },
          id_chat: { type: "number" },
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
