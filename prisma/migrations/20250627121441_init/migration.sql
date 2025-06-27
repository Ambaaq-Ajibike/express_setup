/*
  Warnings:

  - You are about to drop the column `age` on the `children` table. All the data in the column will be lost.
  - You are about to drop the column `code` on the `children` table. All the data in the column will be lost.
  - You are about to drop the column `full_name` on the `children` table. All the data in the column will be lost.
  - You are about to drop the column `image_url` on the `children` table. All the data in the column will be lost.
  - You are about to drop the column `parent_id` on the `children` table. All the data in the column will be lost.
  - You are about to drop the column `sport` on the `children` table. All the data in the column will be lost.
  - You are about to drop the column `full_name` on the `players` table. All the data in the column will be lost.
  - You are about to drop the column `image_url` on the `players` table. All the data in the column will be lost.
  - You are about to drop the column `age_group` on the `teams` table. All the data in the column will be lost.
  - You are about to drop the column `coach_id` on the `teams` table. All the data in the column will be lost.
  - You are about to drop the column `team_code` on the `teams` table. All the data in the column will be lost.
  - You are about to drop the column `created_at` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `email_verified` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `first_name` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `image_url` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `last_name` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `updated_at` on the `users` table. All the data in the column will be lost.
  - You are about to drop the `pitch_owner_facilities` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `pitch_owners` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `player_teams` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `referee_certifications` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[playerId]` on the table `children` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[userId]` on the table `players` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[teamCode]` on the table `teams` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `parentId` to the `children` table without a default value. This is not possible if the table is not empty.
  - Added the required column `playerId` to the `children` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `players` table without a default value. This is not possible if the table is not empty.
  - Added the required column `ageGroup` to the `teams` table without a default value. This is not possible if the table is not empty.
  - Added the required column `teamCode` to the `teams` table without a default value. This is not possible if the table is not empty.
  - Added the required column `firstName` to the `users` table without a default value. This is not possible if the table is not empty.
  - Added the required column `lastName` to the `users` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `users` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
ALTER TYPE "AgeGroup" ADD VALUE 'Above';

-- DropForeignKey
ALTER TABLE "children" DROP CONSTRAINT "children_parent_id_fkey";

-- DropForeignKey
ALTER TABLE "pitch_owner_facilities" DROP CONSTRAINT "pitch_owner_facilities_pitch_owner_id_fkey";

-- DropForeignKey
ALTER TABLE "pitch_owners" DROP CONSTRAINT "pitch_owners_user_id_fkey";

-- DropForeignKey
ALTER TABLE "player_teams" DROP CONSTRAINT "player_teams_player_id_fkey";

-- DropForeignKey
ALTER TABLE "player_teams" DROP CONSTRAINT "player_teams_team_id_fkey";

-- DropForeignKey
ALTER TABLE "teams" DROP CONSTRAINT "teams_coach_id_fkey";

-- DropIndex
DROP INDEX "children_code_idx";

-- DropIndex
DROP INDEX "children_code_key";

-- DropIndex
DROP INDEX "children_parent_id_idx";

-- DropIndex
DROP INDEX "teams_coach_id_idx";

-- DropIndex
DROP INDEX "teams_team_code_idx";

-- DropIndex
DROP INDEX "teams_team_code_key";

-- AlterTable
ALTER TABLE "children" DROP COLUMN "age",
DROP COLUMN "code",
DROP COLUMN "full_name",
DROP COLUMN "image_url",
DROP COLUMN "parent_id",
DROP COLUMN "sport",
ADD COLUMN     "parentId" TEXT NOT NULL,
ADD COLUMN     "playerId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "players" DROP COLUMN "full_name",
DROP COLUMN "image_url",
ADD COLUMN     "imageUrl" TEXT,
ADD COLUMN     "userId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "teams" DROP COLUMN "age_group",
DROP COLUMN "coach_id",
DROP COLUMN "team_code",
ADD COLUMN     "ageGroup" "AgeGroup" NOT NULL,
ADD COLUMN     "teamCode" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "users" DROP COLUMN "created_at",
DROP COLUMN "email_verified",
DROP COLUMN "first_name",
DROP COLUMN "image_url",
DROP COLUMN "last_name",
DROP COLUMN "updated_at",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "emailVerified" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "firstName" TEXT NOT NULL,
ADD COLUMN     "imageUrl" TEXT,
ADD COLUMN     "lastName" TEXT NOT NULL,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- DropTable
DROP TABLE "pitch_owner_facilities";

-- DropTable
DROP TABLE "pitch_owners";

-- DropTable
DROP TABLE "player_teams";

-- DropTable
DROP TABLE "referee_certifications";

-- CreateTable
CREATE TABLE "coaches" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "coaches_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "coachTeams" (
    "coachId" TEXT NOT NULL,
    "teamId" TEXT NOT NULL,
    "joinedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "coachTeams_pkey" PRIMARY KEY ("coachId","teamId")
);

-- CreateTable
CREATE TABLE "playerTeams" (
    "playerId" TEXT NOT NULL,
    "teamId" TEXT NOT NULL,
    "joinedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "playerTeams_pkey" PRIMARY KEY ("playerId","teamId")
);

-- CreateTable
CREATE TABLE "referees" (
    "id" TEXT NOT NULL,
    "certification" TEXT NOT NULL,
    "certificates" TEXT[],
    "userId" TEXT NOT NULL,

    CONSTRAINT "referees_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "pitchOwners" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "verificationDocumentUrl" TEXT,

    CONSTRAINT "pitchOwners_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "pitchOwnerFacilities" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "images" TEXT[],
    "pitchOwnerId" TEXT NOT NULL,

    CONSTRAINT "pitchOwnerFacilities_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "coaches_userId_key" ON "coaches"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "referees_userId_key" ON "referees"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "pitchOwners_userId_key" ON "pitchOwners"("userId");

-- CreateIndex
CREATE INDEX "pitchOwnerFacilities_pitchOwnerId_idx" ON "pitchOwnerFacilities"("pitchOwnerId");

-- CreateIndex
CREATE UNIQUE INDEX "children_playerId_key" ON "children"("playerId");

-- CreateIndex
CREATE INDEX "children_parentId_idx" ON "children"("parentId");

-- CreateIndex
CREATE UNIQUE INDEX "players_userId_key" ON "players"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "teams_teamCode_key" ON "teams"("teamCode");

-- CreateIndex
CREATE INDEX "teams_teamCode_idx" ON "teams"("teamCode");

-- AddForeignKey
ALTER TABLE "coaches" ADD CONSTRAINT "coaches_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "coachTeams" ADD CONSTRAINT "coachTeams_coachId_fkey" FOREIGN KEY ("coachId") REFERENCES "coaches"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "coachTeams" ADD CONSTRAINT "coachTeams_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "teams"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "players" ADD CONSTRAINT "players_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "playerTeams" ADD CONSTRAINT "playerTeams_playerId_fkey" FOREIGN KEY ("playerId") REFERENCES "players"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "playerTeams" ADD CONSTRAINT "playerTeams_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "teams"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "children" ADD CONSTRAINT "children_playerId_fkey" FOREIGN KEY ("playerId") REFERENCES "players"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "children" ADD CONSTRAINT "children_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "parents"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "referees" ADD CONSTRAINT "referees_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pitchOwners" ADD CONSTRAINT "pitchOwners_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pitchOwnerFacilities" ADD CONSTRAINT "pitchOwnerFacilities_pitchOwnerId_fkey" FOREIGN KEY ("pitchOwnerId") REFERENCES "pitchOwners"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
