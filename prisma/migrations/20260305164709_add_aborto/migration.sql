-- CreateTable
CREATE TABLE "Aborto" (
    "id" TEXT NOT NULL,
    "fecha" DATE NOT NULL,
    "observaciones" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "animal_id" TEXT NOT NULL,

    CONSTRAINT "Aborto_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Aborto" ADD CONSTRAINT "Aborto_animal_id_fkey" FOREIGN KEY ("animal_id") REFERENCES "Animal"("id") ON DELETE CASCADE ON UPDATE CASCADE;
