/*
  Warnings:

  - The primary key for the `galleryimage` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `image` on the `galleryimage` table. All the data in the column will be lost.
  - Added the required column `url` to the `GalleryImage` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `galleryimage` DROP PRIMARY KEY,
    DROP COLUMN `image`,
    ADD COLUMN `url` VARCHAR(191) NOT NULL,
    MODIFY `id` VARCHAR(191) NOT NULL,
    ALTER COLUMN `order` DROP DEFAULT,
    ADD PRIMARY KEY (`id`);

-- RenameIndex
ALTER TABLE `galleryimage` RENAME INDEX `GalleryImage_galleryId_fkey` TO `GalleryImage_galleryId_idx`;
