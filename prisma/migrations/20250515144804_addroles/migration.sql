/*
  Warnings:

  - Added the required column `roles` to the `Users` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "Roles" AS ENUM ('ADMIN', 'ADMINSUPPORT', 'DRIVER', 'RIDER');

-- AlterTable
ALTER TABLE "Users" ADD COLUMN     "roles" "Roles" NOT NULL;
