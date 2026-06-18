-- DropForeignKey
ALTER TABLE `chat` DROP FOREIGN KEY `chat_id_anuncio_fkey`;

-- DropForeignKey
ALTER TABLE `imagem` DROP FOREIGN KEY `imagem_id_anuncio_fkey`;

-- DropForeignKey
ALTER TABLE `mensagem` DROP FOREIGN KEY `mensagem_id_chat_fkey`;

-- AddForeignKey
ALTER TABLE `imagem` ADD CONSTRAINT `imagem_id_anuncio_fkey` FOREIGN KEY (`id_anuncio`) REFERENCES `anuncio`(`id_anuncio`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `chat` ADD CONSTRAINT `chat_id_anuncio_fkey` FOREIGN KEY (`id_anuncio`) REFERENCES `anuncio`(`id_anuncio`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `mensagem` ADD CONSTRAINT `mensagem_id_chat_fkey` FOREIGN KEY (`id_chat`) REFERENCES `chat`(`id_chat`) ON DELETE CASCADE ON UPDATE CASCADE;
