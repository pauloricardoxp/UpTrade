export const authSchemas = {
  register: {
    tags: ["Auth"],
    summary: "Registrar na plataforma",
    body: {
      type: "object",
      required: ["nome", "email", "senha", "cpf", "telefone"],
      properties: {
        nome: { type: "string", default: "Teste" },
        email: { type: "string", default: "teste@email.com" },
        senha: { type: "string", default: "123456" },
        cpf: { type: "string", default: "12345678901" },
        telefone: { type: "string", default: "81999999999" },
      },
    },
    response: {
      201: {
        type: "object",
        properties: {
          id_usuario: { type: "number" },
          nome: { type: "string" },
          email: { type: "string" },
          cpf: { type: "string" },
          telefone: { type: "string" },
          data_cadastro: { type: "string" },
        },
      },
    },
  },

  login: {
    tags: ["Auth"],
    summary: "Login na plataforma",
    body: {
      type: "object",
      required: ["email", "senha"],
      properties: {
        email: { type: "string", default: "teste@email.com" },
        senha: { type: "string", default: "123456" },
      },
    },
    response: {
      200: {
        type: "object",
        properties: {
          token: { type: "string" },
          nome: { type: "string" },
        },
      },
    },
  },
};
