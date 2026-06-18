/*
  Warnings:

  - Added the required column `id_usuario` to the `chat` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `chat` ADD COLUMN `id_usuario` INTEGER NOT NULL;
