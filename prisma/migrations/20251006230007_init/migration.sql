-- CreateTable
CREATE TABLE "appointment" (
    "id" TEXT NOT NULL,
    "tutorName" TEXT NOT NULL,
    "petName" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "scheduleAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "appointment_pkey" PRIMARY KEY ("id")
);
