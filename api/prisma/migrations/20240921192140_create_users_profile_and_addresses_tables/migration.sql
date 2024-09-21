-- CreateEnum
CREATE TYPE "Role" AS ENUM ('ADMIN', 'COLABORADOR', 'PROFESSOR', 'JOGADOR');

-- CreateEnum
CREATE TYPE "Genre" AS ENUM ('MASCULINO', 'FEMININO', 'NAO_INFORMADO');

-- CreateTable
CREATE TABLE "Users" (
    "id" TEXT NOT NULL,
    "google_id" VARCHAR(30),
    "microsoft_id" VARCHAR(45),
    "facebook_id" VARCHAR(25),
    "email" VARCHAR(100) NOT NULL,
    "password" VARCHAR(80),
    "role" "Role" NOT NULL DEFAULT 'JOGADOR',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Profile" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "username" VARCHAR(40) NOT NULL,
    "avatar_url" VARCHAR(255),
    "genre" "Genre" NOT NULL DEFAULT 'NAO_INFORMADO',
    "birth_date" VARCHAR(12),

    CONSTRAINT "Profile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Addresses" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "country" VARCHAR(120),
    "state" VARCHAR(120),
    "city" VARCHAR(120),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Addresses_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Users_google_id_key" ON "Users"("google_id");

-- CreateIndex
CREATE UNIQUE INDEX "Users_microsoft_id_key" ON "Users"("microsoft_id");

-- CreateIndex
CREATE UNIQUE INDEX "Users_facebook_id_key" ON "Users"("facebook_id");

-- CreateIndex
CREATE UNIQUE INDEX "Users_email_key" ON "Users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Profile_user_id_key" ON "Profile"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "Profile_username_key" ON "Profile"("username");

-- CreateIndex
CREATE UNIQUE INDEX "Addresses_state_key" ON "Addresses"("state");

-- AddForeignKey
ALTER TABLE "Profile" ADD CONSTRAINT "Profile_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "Users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Addresses" ADD CONSTRAINT "Addresses_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "Users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
