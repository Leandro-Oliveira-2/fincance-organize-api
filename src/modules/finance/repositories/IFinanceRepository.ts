import { VariableExpense, FixedExpense, User } from "@prisma/client";

export interface IFinanceRepository {
    calculateTotalExpenses(userId: number, year: number): Promise<{ fixed: number, variable: number, total: number }>;
    getUserExpenses(userId: number): Promise<{
        user: User;
        fixedExpenses: FixedExpense[];
        variableExpenses: VariableExpense[];
    }>;
    getUserExpensesByDate(userId: number, year: number, month?: number, day?: number): Promise<{ user: User | null, fixedExpenses: FixedExpense[], variableExpenses: VariableExpense[] }>;
    getUserExpensesByPeriod(userId: number, startDate: Date, endDate: Date): Promise<{ user: User | null, fixedExpenses: FixedExpense[], variableExpenses: VariableExpense[] }>;
}
