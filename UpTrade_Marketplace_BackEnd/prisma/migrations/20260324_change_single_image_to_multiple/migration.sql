-- AlterTable
ALTER TABLE `imagem` ADD COLUMN `id_anuncio` INTEGER NULL;

-- DropForeignKey
ALTER TABLE `anuncio` DROP FOREIGN KEY `anuncio_id_imagem_fkey`;

-- AlterTable
ALTER TABLE `anuncio` DROP COLUMN `id_imagem`;

-- AddForeignKey
ALTER TABLE `imagem` ADD CONSTRAINT `imagem_id_anuncio_fkey` FOREIGN KEY (`id_anuncio`) REFERENCES `anuncio`(`id_anuncio`) ON DELETE SET NULL ON UPDATE CASCADE;
