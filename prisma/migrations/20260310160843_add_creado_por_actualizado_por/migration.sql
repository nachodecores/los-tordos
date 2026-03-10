-- AlterTable
ALTER TABLE "Aborto" ADD COLUMN     "creado_por" TEXT;

-- AlterTable
ALTER TABLE "Animal" ADD COLUMN     "actualizado_por" TEXT,
ADD COLUMN     "creado_por" TEXT;

-- AlterTable
ALTER TABLE "Parto" ADD COLUMN     "creado_por" TEXT;

-- AlterTable
ALTER TABLE "Secado" ADD COLUMN     "creado_por" TEXT;

-- AlterTable
ALTER TABLE "Servicio" ADD COLUMN     "creado_por" TEXT;

-- AlterTable
ALTER TABLE "Tacto" ADD COLUMN     "creado_por" TEXT;
