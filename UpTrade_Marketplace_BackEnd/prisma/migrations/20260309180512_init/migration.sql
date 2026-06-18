-- CreateTable
CREATE TABLE `usuario` (
    `id_usuario` INTEGER NOT NULL AUTO_INCREMENT,
    `nome` VARCHAR(100) NOT NULL,
    `email` VARCHAR(100) NOT NULL,
    `senha` VARCHAR(255) NOT NULL,
    `data_cadastro` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `cpf` CHAR(11) NOT NULL,
    `telefone` VARCHAR(11) NULL,

    UNIQUE INDEX `usuario_email_key`(`email`),
    UNIQUE INDEX `usuario_cpf_key`(`cpf`),
    UNIQUE INDEX `usuario_telefone_key`(`telefone`),
    PRIMARY KEY (`id_usuario`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `categoria` (
    `id_categoria` INTEGER NOT NULL AUTO_INCREMENT,
    `nome_categoria` VARCHAR(50) NOT NULL,
    `descricao` VARCHAR(255) NULL,

    PRIMARY KEY (`id_categoria`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `imagem` (
    `id_imagem` INTEGER NOT NULL AUTO_INCREMENT,
    `url_caminho` VARCHAR(255) NOT NULL,

    PRIMARY KEY (`id_imagem`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `anuncio` (
    `id_anuncio` INTEGER NOT NULL AUTO_INCREMENT,
    `titulo` VARCHAR(100) NOT NULL,
    `descricao` TEXT NOT NULL,
    `preco` DECIMAL(10, 2) NOT NULL,
    `data_criacao` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `condicao` ENUM('NOVO', 'USADO') NOT NULL,
    `marca` VARCHAR(100) NULL,
    `status` ENUM('ATIVO', 'INATIVO', 'TROCADO') NOT NULL DEFAULT 'ATIVO',
    `id_usuario` INTEGER NOT NULL,
    `id_categoria` INTEGER NOT NULL,
    `id_imagem` INTEGER NULL,

    UNIQUE INDEX `anuncio_id_imagem_key`(`id_imagem`),
    PRIMARY KEY (`id_anuncio`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `chat` (
    `id_chat` INTEGER NOT NULL AUTO_INCREMENT,
    `data_criacao` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `id_anuncio` INTEGER NOT NULL,

    PRIMARY KEY (`id_chat`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `mensagem` (
    `id_mensagem` INTEGER NOT NULL AUTO_INCREMENT,
    `texto` TEXT NOT NULL,
    `data_envio` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `lida` BOOLEAN NOT NULL DEFAULT false,
    `id_usuario` INTEGER NOT NULL,
    `id_chat` INTEGER NOT NULL,

    PRIMARY KEY (`id_mensagem`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `anuncio` ADD CONSTRAINT `anuncio_id_usuario_fkey` FOREIGN KEY (`id_usuario`) REFERENCES `usuario`(`id_usuario`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `anuncio` ADD CONSTRAINT `anuncio_id_categoria_fkey` FOREIGN KEY (`id_categoria`) REFERENCES `categoria`(`id_categoria`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `anuncio` ADD CONSTRAINT `anuncio_id_imagem_fkey` FOREIGN KEY (`id_imagem`) REFERENCES `imagem`(`id_imagem`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `chat` ADD CONSTRAINT `chat_id_anuncio_fkey` FOREIGN KEY (`id_anuncio`) REFERENCES `anuncio`(`id_anuncio`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `mensagem` ADD CONSTRAINT `mensagem_id_usuario_fkey` FOREIGN KEY (`id_usuario`) REFERENCES `usuario`(`id_usuario`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `mensagem` ADD CONSTRAINT `mensagem_id_chat_fkey` FOREIGN KEY (`id_chat`) REFERENCES `chat`(`id_chat`) ON DELETE RESTRICT ON UPDATE CASCADE;
