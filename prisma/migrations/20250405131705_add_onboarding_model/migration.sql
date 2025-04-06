-- CreateTable
CREATE TABLE "OnboardingData" (
    "id" TEXT NOT NULL,
    "userId" TEXT,
    "jobTitle" TEXT NOT NULL,
    "company" TEXT,
    "experience" TEXT,
    "jobStability" INTEGER NOT NULL DEFAULT 3,
    "salaryRange" TEXT,
    "topSkills" TEXT[],
    "timeForGrowth" TEXT,
    "linkedinUrl" TEXT,
    "biggestConcern" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "OnboardingData_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "OnboardingData_userId_idx" ON "OnboardingData"("userId");
