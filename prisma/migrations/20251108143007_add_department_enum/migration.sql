-- CreateEnum
CREATE TYPE "Gender" AS ENUM ('male', 'female');

-- CreateEnum
CREATE TYPE "Department" AS ENUM ('CD', 'FA', 'CDV', 'ECO', 'MS', 'ENGMCJ', 'EM', 'YS', 'TESOL', 'TCSOL', 'MATHED', 'CIVTED', 'ITED', 'ARCH', 'HC', 'AI', 'CHE', 'CE', 'MINE', 'CSE', 'BIT', 'CS', 'CYBER', 'EEE', 'GEOM', 'ME', 'BECLL', 'BBMLL', 'BBIS', 'BPH', 'BBA', 'AG', 'BIOINF', 'BT', 'ENVENG', 'ENVS', 'DS', 'CM', 'PHARM', 'AP');

-- CreateTable
CREATE TABLE "Confession" (
    "id" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "department" "Department" NOT NULL,
    "gender" "Gender",
    "year" INTEGER,
    "upvotes" INTEGER NOT NULL DEFAULT 0,
    "downvotes" INTEGER NOT NULL DEFAULT 0,
    "commentsCount" INTEGER NOT NULL DEFAULT 0,
    "views" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Confession_pkey" PRIMARY KEY ("id")
);
