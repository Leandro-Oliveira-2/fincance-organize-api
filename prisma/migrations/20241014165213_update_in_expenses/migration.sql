-- AlterTable
ALTER TABLE "FixedExpense" ADD COLUMN     "category" TEXT NOT NULL DEFAULT 'outros';

-- AlterTable
ALTER TABLE "VariableExpense" ADD COLUMN     "category" TEXT NOT NULL DEFAULT 'outros';
