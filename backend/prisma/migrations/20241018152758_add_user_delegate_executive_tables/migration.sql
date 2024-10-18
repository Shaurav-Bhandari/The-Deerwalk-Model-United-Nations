-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "fullName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "contactInfo" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Delegate" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "institute" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "grade" TEXT NOT NULL,
    "munExperience" INTEGER NOT NULL,
    "primaryCommittee" TEXT NOT NULL,
    "secondaryCommittee" TEXT NOT NULL,
    "foodPreference" TEXT NOT NULL,
    "paymentMethod" TEXT NOT NULL,
    "transactionRecipt" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Delegate_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Executive" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "committee" TEXT NOT NULL,
    "position" TEXT NOT NULL,
    "cvUrl" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Executive_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Delegate_userId_key" ON "Delegate"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Executive_userId_key" ON "Executive"("userId");

-- AddForeignKey
ALTER TABLE "Delegate" ADD CONSTRAINT "Delegate_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Executive" ADD CONSTRAINT "Executive_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
