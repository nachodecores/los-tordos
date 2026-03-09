-- DropForeignKey
ALTER TABLE "Servicio" DROP CONSTRAINT "Servicio_toro_id_fkey";

-- DropTable
DROP TABLE "PeriodoToro";

-- AlterTable
ALTER TABLE "Servicio" DROP COLUMN "toro_id";
