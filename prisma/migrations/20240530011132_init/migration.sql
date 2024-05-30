-- CreateTable
CREATE TABLE "Cancha" (
    "id" SERIAL NOT NULL,
    "descripcion" TEXT NOT NULL,
    "estado" TEXT NOT NULL DEFAULT 'Activo',

    CONSTRAINT "Cancha_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Deportista" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "identificacion" TEXT NOT NULL,
    "equipo" TEXT NOT NULL,
    "estado" TEXT NOT NULL DEFAULT 'Activo',

    CONSTRAINT "Deportista_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SeparacionCancha" (
    "id" SERIAL NOT NULL,
    "canchaId" INTEGER NOT NULL,
    "deportistaId" INTEGER NOT NULL,
    "fechaSeparacion" TIMESTAMP(3) NOT NULL,
    "horaDesde" TIMESTAMP(3) NOT NULL,
    "horaHasta" TIMESTAMP(3) NOT NULL,
    "estado" TEXT NOT NULL DEFAULT 'Activo',

    CONSTRAINT "SeparacionCancha_pkey" PRIMARY KEY ("id")
);
