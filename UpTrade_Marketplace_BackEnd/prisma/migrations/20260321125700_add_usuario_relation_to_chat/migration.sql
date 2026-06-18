-- AddForeignKey
ALTER TABLE `chat` ADD CONSTRAINT `chat_id_usuario_fkey` FOREIGN KEY (`id_usuario`) REFERENCES `usuario`(`id_usuario`) ON DELETE RESTRICT ON UPDATE CASCADE;
