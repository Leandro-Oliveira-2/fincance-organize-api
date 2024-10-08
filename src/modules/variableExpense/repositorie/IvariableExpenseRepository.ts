import { VariableExpense, Prisma } from "@prisma/client";

export interface IVariableExpenseRepository {
    create(data: Prisma.VariableExpenseCreateInput): Promise<VariableExpense>;
    updateVariableExpense(id: number, data: Prisma.VariableExpenseUncheckedUpdateInput): Promise<VariableExpense | null>;
    findById(id: number): Promise<VariableExpense | null>;
    findAllByUserId(userId: number): Promise<VariableExpense[] | []>;
    getVariableExpenses(): Promise<VariableExpense[] | []>;
    delete(id: number): Promise<void>;
}