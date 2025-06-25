-- CreateEnum
CREATE TYPE "Role" AS ENUM ('COACH', 'PLAYER', 'PARENT', 'REFEREE', 'PITCH_OWNER');

-- CreateEnum
CREATE TYPE "AgeGroup" AS ENUM ('U15', 'U16', 'U17', 'U18');

-- CreateEnum
CREATE TYPE "Sport" AS ENUM ('BASEBALL', 'BASKETBALL', 'CRICKET', 'FOOTBALL', 'FUTSAL', 'HANDBALL', 'HOCKEY', 'RUGBY', 'SOFTBALL', 'VOLLEYBALL', 'OTHER');

-- CreateEnum
CREATE TYPE "Tier" AS ENUM ('COMMUNITY', 'INSTITUTIONS', 'ACADEMY', 'PROFESSIONAL', 'OTHERS');

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "first_name" TEXT NOT NULL,
    "last_name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "image_url" TEXT,
    "role" "Role" NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "otps" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "expiry" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "otps_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "teams" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "team_code" TEXT NOT NULL,
    "coach_id" TEXT NOT NULL,
    "age_group" "AgeGroup" NOT NULL,
    "sport" "Sport" NOT NULL,
    "tier" "Tier" NOT NULL,
    "location" TEXT,

    CONSTRAINT "teams_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "players" (
    "id" TEXT NOT NULL,
    "full_name" TEXT NOT NULL,
    "age" INTEGER NOT NULL,
    "sport" "Sport" NOT NULL,
    "image_url" TEXT,
    "code" TEXT NOT NULL,

    CONSTRAINT "players_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "player_teams" (
    "player_id" TEXT NOT NULL,
    "team_id" TEXT NOT NULL,
    "joined_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "player_teams_pkey" PRIMARY KEY ("player_id","team_id")
);

-- CreateTable
CREATE TABLE "parents" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,

    CONSTRAINT "parents_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "children" (
    "id" TEXT NOT NULL,
    "full_name" TEXT NOT NULL,
    "age" INTEGER NOT NULL,
    "sport" "Sport" NOT NULL,
    "image_url" TEXT,
    "code" TEXT NOT NULL,
    "parent_id" TEXT NOT NULL,

    CONSTRAINT "children_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "referee_certifications" (
    "id" TEXT NOT NULL,
    "certification" TEXT NOT NULL,
    "certificates" TEXT[],
    "referee_id" TEXT NOT NULL,

    CONSTRAINT "referee_certifications_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "pitch_owners" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "verification_document_url" TEXT,

    CONSTRAINT "pitch_owners_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "pitch_owner_facilities" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "description" TEXT,
    "images" TEXT[],
    "pitch_owner_id" TEXT NOT NULL,

    CONSTRAINT "pitch_owner_facilities_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE INDEX "users_email_idx" ON "users"("email");

-- CreateIndex
CREATE INDEX "users_role_idx" ON "users"("role");

-- CreateIndex
CREATE INDEX "otps_user_id_idx" ON "otps"("user_id");

-- CreateIndex
CREATE INDEX "otps_expiry_idx" ON "otps"("expiry");

-- CreateIndex
CREATE UNIQUE INDEX "teams_team_code_key" ON "teams"("team_code");

-- CreateIndex
CREATE INDEX "teams_coach_id_idx" ON "teams"("coach_id");

-- CreateIndex
CREATE INDEX "teams_team_code_idx" ON "teams"("team_code");

-- CreateIndex
CREATE UNIQUE INDEX "players_code_key" ON "players"("code");

-- CreateIndex
CREATE INDEX "players_code_idx" ON "players"("code");

-- CreateIndex
CREATE UNIQUE INDEX "parents_user_id_key" ON "parents"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "children_code_key" ON "children"("code");

-- CreateIndex
CREATE INDEX "children_parent_id_idx" ON "children"("parent_id");

-- CreateIndex
CREATE INDEX "children_code_idx" ON "children"("code");

-- CreateIndex
CREATE UNIQUE INDEX "pitch_owners_user_id_key" ON "pitch_owners"("user_id");

-- CreateIndex
CREATE INDEX "pitch_owner_facilities_pitch_owner_id_idx" ON "pitch_owner_facilities"("pitch_owner_id");

-- AddForeignKey
ALTER TABLE "otps" ADD CONSTRAINT "otps_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "teams" ADD CONSTRAINT "teams_coach_id_fkey" FOREIGN KEY ("coach_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "player_teams" ADD CONSTRAINT "player_teams_player_id_fkey" FOREIGN KEY ("player_id") REFERENCES "players"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "player_teams" ADD CONSTRAINT "player_teams_team_id_fkey" FOREIGN KEY ("team_id") REFERENCES "teams"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "parents" ADD CONSTRAINT "parents_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "children" ADD CONSTRAINT "children_parent_id_fkey" FOREIGN KEY ("parent_id") REFERENCES "parents"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pitch_owners" ADD CONSTRAINT "pitch_owners_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pitch_owner_facilities" ADD CONSTRAINT "pitch_owner_facilities_pitch_owner_id_fkey" FOREIGN KEY ("pitch_owner_id") REFERENCES "pitch_owners"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
