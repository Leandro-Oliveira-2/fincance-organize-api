import { Prisma, FixedExpense} from "@prisma/client";

export interface IFixedExpenseRepository {
    create(data: Prisma.FixedExpenseCreateInput): Promise<FixedExpense>;
    updateFixedExpense(id: number, data: Prisma.FixedExpenseUncheckedUpdateInput): Promise<FixedExpense | null>;
    findById(id: number): Promise<FixedExpense | null>;
    findAllByUserId(userId: number): Promise<FixedExpense[] | []>;
    getFixedExpenses(): Promise<FixedExpense[] | []>;
    delete(id: number): Promise<void>;
}