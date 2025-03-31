/*
  Warnings:

  - You are about to alter the column `email` on the `Doctor` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(255)`.
  - You are about to alter the column `name` on the `Doctor` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(100)`.
  - You are about to drop the column `age` on the `Patient` table. All the data in the column will be lost.
  - You are about to alter the column `name` on the `Patient` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(100)`.
  - Added the required column `degree` to the `Doctor` table without a default value. This is not possible if the table is not empty.
  - Added the required column `gender` to the `Doctor` table without a default value. This is not possible if the table is not empty.
  - Added the required column `practiceStarted` to the `Doctor` table without a default value. This is not possible if the table is not empty.
  - Added the required column `speciality` to the `Doctor` table without a default value. This is not possible if the table is not empty.
  - Added the required column `allergies` to the `Patient` table without a default value. This is not possible if the table is not empty.
  - Added the required column `bloodGroup` to the `Patient` table without a default value. This is not possible if the table is not empty.
  - Added the required column `dob` to the `Patient` table without a default value. This is not possible if the table is not empty.
  - Added the required column `email` to the `Patient` table without a default value. This is not possible if the table is not empty.
  - Added the required column `medicalHistory` to the `Patient` table without a default value. This is not possible if the table is not empty.
  - Added the required column `phoneNumber` to the `Patient` table without a default value. This is not possible if the table is not empty.
  - Added the required column `smokingStatus` to the `Patient` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "Gender" AS ENUM ('MALE', 'FEMALE', 'OTHER');

-- CreateEnum
CREATE TYPE "SmokingStatus" AS ENUM ('PRESENT', 'NEVER', 'PAST');

-- CreateEnum
CREATE TYPE "UrgencyLevel" AS ENUM ('LOW', 'MEDIUM', 'HIGH');

-- AlterTable
ALTER TABLE "Doctor" ADD COLUMN     "degree" VARCHAR(100) NOT NULL,
ADD COLUMN     "gender" "Gender" NOT NULL,
ADD COLUMN     "practiceStarted" INTEGER NOT NULL,
ADD COLUMN     "speciality" VARCHAR(100) NOT NULL,
ALTER COLUMN "email" SET DATA TYPE VARCHAR(255),
ALTER COLUMN "name" SET DATA TYPE VARCHAR(100);

-- AlterTable
ALTER TABLE "Patient" DROP COLUMN "age",
ADD COLUMN     "allergies" TEXT NOT NULL,
ADD COLUMN     "bloodGroup" VARCHAR(4) NOT NULL,
ADD COLUMN     "dob" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "email" VARCHAR(255) NOT NULL,
ADD COLUMN     "medicalHistory" TEXT NOT NULL,
ADD COLUMN     "phoneNumber" VARCHAR(15) NOT NULL,
ADD COLUMN     "smokingStatus" "SmokingStatus" NOT NULL,
ALTER COLUMN "name" SET DATA TYPE VARCHAR(100);

-- CreateTable
CREATE TABLE "Reading" (
    "id" TEXT NOT NULL,
    "patientId" TEXT NOT NULL,
    "diagnosedFor" VARCHAR(100) NOT NULL,
    "height" DOUBLE PRECISION,
    "weight" DOUBLE PRECISION,
    "temperature" DOUBLE PRECISION NOT NULL,
    "heartRate" INTEGER NOT NULL,
    "bpSystolic" INTEGER,
    "bpDiastolic" INTEGER,
    "respiratoryRate" INTEGER,
    "glucoseLevel" DOUBLE PRECISION,
    "oxygenSaturation" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Reading_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Report" (
    "id" TEXT NOT NULL,
    "doctorId" TEXT NOT NULL,
    "patientId" TEXT NOT NULL,
    "summary" TEXT NOT NULL,
    "detailedAnalysis" TEXT NOT NULL,
    "diagnosis" TEXT NOT NULL,
    "recommendations" TEXT NOT NULL,
    "urgencyLevel" "UrgencyLevel" NOT NULL,
    "additionalNotes" TEXT NOT NULL,

    CONSTRAINT "Report_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Reading" ADD CONSTRAINT "Reading_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "Patient"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Report" ADD CONSTRAINT "Report_doctorId_fkey" FOREIGN KEY ("doctorId") REFERENCES "Doctor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Report" ADD CONSTRAINT "Report_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "Patient"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
