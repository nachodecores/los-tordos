-- CreateEnum
CREATE TYPE "TipoAnimal" AS ENUM ('vaca', 'toro', 'vaquillona');

-- CreateEnum
CREATE TYPE "CategoriaVaca" AS ENUM ('en_ordene', 'seca');

-- CreateEnum
CREATE TYPE "EstadoAnimal" AS ENUM ('activo', 'vendido', 'muerto');

-- CreateEnum
CREATE TYPE "ResultadoTacto" AS ENUM ('prenada', 'vacia');

-- CreateTable
CREATE TABLE "Animal" (
    "id" TEXT NOT NULL,
    "caravana" TEXT NOT NULL,
    "tipo" "TipoAnimal" NOT NULL,
    "categoria" "CategoriaVaca",
    "estado" "EstadoAnimal" NOT NULL,
    "fecha_nacimiento" DATE,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Animal_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Servicio" (
    "id" TEXT NOT NULL,
    "fecha" DATE NOT NULL,
    "observaciones" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "animal_id" TEXT NOT NULL,
    "toro_id" TEXT NOT NULL,

    CONSTRAINT "Servicio_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Tacto" (
    "id" TEXT NOT NULL,
    "fecha" DATE NOT NULL,
    "resultado" "ResultadoTacto" NOT NULL,
    "fecha_estimada_parto" DATE,
    "observaciones" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "animal_id" TEXT NOT NULL,
    "servicio_id" TEXT,

    CONSTRAINT "Tacto_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Parto" (
    "id" TEXT NOT NULL,
    "fecha" DATE NOT NULL,
    "observaciones" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "animal_id" TEXT NOT NULL,

    CONSTRAINT "Parto_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PeriodoToro" (
    "id" TEXT NOT NULL,
    "fecha_inicio" DATE NOT NULL,
    "fecha_fin" DATE,
    "observaciones" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "toro_id" TEXT NOT NULL,

    CONSTRAINT "PeriodoToro_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Animal_caravana_key" ON "Animal"("caravana");

-- AddForeignKey
ALTER TABLE "Servicio" ADD CONSTRAINT "Servicio_animal_id_fkey" FOREIGN KEY ("animal_id") REFERENCES "Animal"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Servicio" ADD CONSTRAINT "Servicio_toro_id_fkey" FOREIGN KEY ("toro_id") REFERENCES "Animal"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Tacto" ADD CONSTRAINT "Tacto_animal_id_fkey" FOREIGN KEY ("animal_id") REFERENCES "Animal"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Tacto" ADD CONSTRAINT "Tacto_servicio_id_fkey" FOREIGN KEY ("servicio_id") REFERENCES "Servicio"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Parto" ADD CONSTRAINT "Parto_animal_id_fkey" FOREIGN KEY ("animal_id") REFERENCES "Animal"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PeriodoToro" ADD CONSTRAINT "PeriodoToro_toro_id_fkey" FOREIGN KEY ("toro_id") REFERENCES "Animal"("id") ON DELETE CASCADE ON UPDATE CASCADE;
