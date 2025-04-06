-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "user_id" TEXT,
    "email" TEXT NOT NULL,
    "full_name" TEXT,
    "avatar_url" TEXT,
    "auth_provider" TEXT,
    "email_verified" BOOLEAN NOT NULL DEFAULT false,
    "phone" TEXT,
    "last_sign_in_at" TIMESTAMP(3),
    "updated_at" TIMESTAMP(3) NOT NULL,
    "provider_id" TEXT,
    "provider_sub" TEXT,
    "is_anonymous" BOOLEAN NOT NULL DEFAULT false,
    "role" TEXT DEFAULT 'user',
    "refresh_token" TEXT,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_user_id_key" ON "User"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- AddForeignKey
ALTER TABLE "OnboardingData" ADD CONSTRAINT "OnboardingData_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
