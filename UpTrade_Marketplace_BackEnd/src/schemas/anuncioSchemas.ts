export const anuncioSchemas = {
  getAll: {
    tags: ["Anuncio"],
    summary: "Listar todos os anuncios",
    response: {
      200: {
        type: "array",
        items: {
          type: "object",
          properties: {
            id_anuncio: { type: "number" },
            titulo: { type: "string" },
            descricao: { type: "string" },
            preco: { type: "string" },
            data_criacao: { type: "string" },
            condicao: { type: "string" },
            marca: { type: "string" },
            status: { type: "string" },
            id_usuario: { type: "number" },
            categoria: { type: "string" },
            imagens: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  id_imagem: { type: "number" },
                  url_caminho: { type: "string" },
                },
              },
            },
            usuario: {
              type: "object",
              nullable: true,
              properties: {
                nome: { type: "string" },
                foto_perfil: { type: "string" },
              },
            },
          },
        },
      },
    },
  },
  getById: {
    tags: ["Anuncio"],
    summary: "Listar por anuncio por id",
    params: {
      type: "object",
      properties: {
        id_anuncio: { type: "number", default: "1" },
      },
    },
    response: {
      200: {
        type: "object",
        properties: {
          id_anuncio: { type: "number" },
          titulo: { type: "string" },
          descricao: { type: "string" },
          preco: { type: "string" },
          data_criacao: { type: "string" },
          condicao: { type: "string" },
          marca: { type: "string" },
          status: { type: "string" },
          id_usuario: { type: "number" },
          categoria: { type: "string" },
          imagens: {
            type: "array",
            items: {
              type: "object",
              properties: {
                id_imagem: { type: "number" },
                url_caminho: { type: "string" },
              },
            },
          },
          usuario: {
            type: "object",
            nullable: true,
            properties: {
              nome: { type: "string" },
              foto_perfil: { type: "string" },
            },
          },
        },
      },
    },
  },
  create: {
    tags: ["Anuncio"],
    summary: "Criar um anuncio na plataforma",
    body: {
      type: "object",
      required: [
        "titulo",
        "descricao",
        "preco",
        "condicao",
        "marca",
        "categoria",
      ],
      properties: {
        titulo: { type: "string", default: "Anuncio Teste" },
        descricao: { type: "string", default: "Descricao Teste" },
        preco: { type: "string", default: "10.90" },
        condicao: { type: "string", default: "NOVO" },
        marca: { type: "string", default: "AMD" },
        id_imagens: {
          type: "array",
          items: { type: "number" },
          maxItems: 5,
        },
        categoria: { type: "string", default: "CPU" },
      },
    },
    response: {
      201: {
        type: "object",
        properties: {
          id_anuncio: { type: "number" },
          titulo: { type: "string" },
          descricao: { type: "string" },
          preco: { type: "number" },
          data_criacao: { type: "string" },
          marca: { type: "string" },
          status: { type: "string" },
          id_usuario: { type: "number" },
          categoria: { type: "string" },
        },
      },
    },
  },
  update: {
    tags: ["Anuncio"],
    summary: "Editar um anuncio na plataforma",
    security: [{ bearerAuth: [] }],
    params: {
      type: "object",
      properties: {
        id_anuncio: { type: "number", default: "1" },
      },
    },
    body: {
      type: "object",
      required: [
        "titulo",
        "descricao",
        "preco",
        "condicao",
        "marca",
        "categoria",
      ],
      properties: {
        titulo: { type: "string", default: "Anuncio Teste" },
        descricao: { type: "string", default: "Descricao Teste" },
        preco: { type: "string", default: "10.90" },
        condicao: { type: "string", default: "NOVO" },
        marca: { type: "string", default: "AMD" },
        id_imagens: {
          type: "array",
          items: { type: "number" },
          maxItems: 5,
        },
        categoria: { type: "string", default: "CPU" },
      },
    },
    response: {
      200: {
        type: "object",
        properties: {
          id_anuncio: { type: "number" },
          titulo: { type: "string" },
          descricao: { type: "string" },
          preco: { type: "number" },
          data_criacao: { type: "string" },
          marca: { type: "string" },
          status: { type: "string" },
          id_usuario: { type: "number" },
          categoria: { type: "string" },
        },
      },
    },
  },
  delete: {
    tags: ["Anuncio"],
    summary: "Deletar um anuncio na plataforma",
    security: [{ bearerAuth: [] }],
    params: {
      type: "object",
      properties: {
        id_anuncio: { type: "number", default: "1" },
      },
    },
    response: {
      204: {
        type: "null",
        description: "Anuncio deletado com sucesso",
      },
    },
  },
  getAllMy: {
    tags: ["Anuncio"],
    summary: "Listar anuncios de um usuario na plataforma",
    security: [{ bearerAuth: [] }],
    response: {
      200: {
        type: "array",
        items: {
          type: "object",
          properties: {
            id_anuncio: { type: "number" },
            titulo: { type: "string" },
            descricao: { type: "string" },
            preco: { type: "string" },
            data_criacao: { type: "string" },
            condicao: { type: "string" },
            marca: { type: "string" },
            status: { type: "string" },
            id_usuario: { type: "number" },
            categoria: { type: "string" },
            imagens: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  id_imagem: { type: "number" },
                  url_caminho: { type: "string" },
                },
              },
            },
          },
        },
      },
    },
  },
};
