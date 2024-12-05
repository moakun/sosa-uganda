-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "fullName" VARCHAR(100) NOT NULL,
    "email" VARCHAR(100) NOT NULL,
    "companyName" VARCHAR(255) NOT NULL,
    "password" VARCHAR(255) NOT NULL,
    "video1" BOOLEAN NOT NULL DEFAULT false,
    "video2" BOOLEAN NOT NULL DEFAULT false,
    "score" DOUBLE PRECISION,
    "gotAttestation" BOOLEAN NOT NULL DEFAULT false,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "dispositif" VARCHAR(255),
    "engagement" VARCHAR(255),
    "identification" VARCHAR(255),
    "formation" VARCHAR(255),
    "procedure" VARCHAR(255),
    "dispositifAlert" VARCHAR(255),
    "certifierISO" VARCHAR(255),
    "mepSystem" VARCHAR(255),
    "intention" VARCHAR(255),

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_id_key" ON "User"("id");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_companyName_key" ON "User"("companyName");
