# UpTrade Marketplace Backend 

![Node.js](https://img.shields.io/badge/Node.js-v18+-green)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue)
![Fastify](https://img.shields.io/badge/Fastify-5.8-orange)
![MySQL](https://img.shields.io/badge/MySQL-8.0+-blue)
![Prisma](https://img.shields.io/badge/Prisma-5.22-green)


Servidor API RESTful backend para a plataforma **UpTrade Marketplace** — um marketplace de trocas de componentes de computador e hardware. A aplicação permite usuários registrarem-se, criar anúncios, buscar produtos, iniciar chats e gerenciar perfis.

---

## Visão Geral

**UpTrade** é uma plataforma de marketplace focada em negociações de componentes de hardware (CPUs, GPUs, memória, etc.). O backend fornece:

✅ Autenticação e autorização com JWT  
✅ CRUD completo de anúncios com filtros  
✅ Sistema de chats e mensagens entre usuários  
✅ Upload de imagens para Cloudinary  
✅ Gerenciamento de perfil de usuário  
✅ Documentação automática com Swagger/Scalar  
✅ Validação de dados com JSON schemas

---

## Tech Stack

### Runtime & Language

- **Node.js** com **TypeScript** ES2022
- **Fastify 5.8.2** — Framework HTTP de alta performance

### Banco de Dados

- **MySQL 8.0+** — Banco de dados relacional
- **Prisma 5.22.0** — ORM e migração automática

### Autenticação & Segurança

- **JWT** (@fastify/jwt) — Token-based authentication (1 hora de expiração)
- **bcrypt 6.0.0** — Hashing de senhas com salt 10

### Upload de Arquivos

- **Cloudinary** — Hospedagem de imagens na nuvem
- **@fastify/multipart** — Middleware de upload (limite: 5MB)

### Utilitários

- **@fastify/cors** — CORS configurado para `localhost:5173`
- **@fastify/swagger + @scalar/fastify-api-reference** — Documentação OpenAPI
- **dotenv 17.3.1** — Variáveis de ambiente
- **tsx 4.21.0** — Execução TypeScript

---

## Arquitetura

### Padrão MVC-like com Camadas

```
HTTP Request (Fastify Route)
    ↓
JWT Middleware (Autenticação)
    ↓
Controller (Extrai dados, chama service)
    ↓
Service (Lógica de negócio, validações)
    ↓
Prisma Client (Query builder)
    ↓
MySQL Database
```

### Camadas da Aplicação

| Camada          | Responsabilidade                                            |
| --------------- | ----------------------------------------------------------- |
| **Routes**      | Define endpoints HTTP, schemas, middlewares                 |
| **Controllers** | Extrai dados da requisição, chama service, formata resposta |
| **Services**    | Lógica de negócio, validações, queries com Prisma           |
| **Plugins**     | Extensões Fastify (JWT, Prisma, Cloudinary, CORS)           |
| **Types**       | Interfaces TypeScript para tipagem                          |
| **Schemas**     | Validação de entrada + documentação Swagger                 |

---

## Instalação

### Pré-requisitos

- **Node.js** v18 ou superior
- **npm** ou **yarn**
- **MySQL** 8.0+ instalado e rodando
- **Conta Cloudinary** (para upload de imagens)

### Passo 1: Clonar o repositório

```bash
git clone https://github.com/pauloricardoxp/UpTrade_Marketplace_BackEnd.git
cd UpTrade_Marketplace_BackEnd
```

### Passo 2: Instalar dependências

```bash
npm install
```

### Passo 3: Configurar variáveis de ambiente

Crie um arquivo `.env` na raiz do projeto:

```env

DATABASE_URL="mysql://usuario:senha@localhost:3306/marketplace_db"
JWT_SECRET="uma_chave_secreta_super_secreta_aqui"
CLOUDINARY_CLOUD_NAME="seu_cloud_name"
CLOUDINARY_API_KEY="sua_api_key"
CLOUDINARY_API_SECRET="seu_api_secret"
```

### Passo 4: Criar banco de dados

```bash
CREATE DATABASE marketplace_db;
```

### Passo 5: Rodar migrations

```bash
npm run db:migrate
```

### Passo 6: Iniciar o servidor

```bash
npm run dev
```

O servidor estará disponível em: `http://localhost:8080`  
Documentação Swagger: `http://localhost:8080/docs`

