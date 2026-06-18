/*
  Warnings:

  - You are about to drop the column `id_categoria` on the `anuncio` table. All the data in the column will be lost.
  - You are about to drop the `categoria` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `categoria` to the `anuncio` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `anuncio` DROP FOREIGN KEY `anuncio_id_categoria_fkey`;

-- AlterTable
ALTER TABLE `anuncio` DROP COLUMN `id_categoria`,
    ADD COLUMN `categoria` ENUM('CPU', 'GPU', 'PLACA_MAE', 'RAM', 'FONTE', 'GABINETE', 'ARMAZENAMENTO', 'COOLER', 'MONITOR', 'TECLADO', 'MOUSE', 'HEADSET') NOT NULL;

-- DropTable
DROP TABLE `categoria`;
