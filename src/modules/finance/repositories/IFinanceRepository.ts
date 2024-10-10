import { VariableExpense, FixedExpense, User } from "@prisma/client";

export interface IFinanceRepository {
    calculateExpenses(
        userId: number,
        year: number,
        startMonth?: number,    
        numberOfMonths?: number,
        startDate?: Date,       
        endDate?: Date          
    ): Promise<{ fixed: number; variable: number; total: number }>;
    getUserExpenses(userId: number): Promise<{
        user: User;
        fixedExpenses: FixedExpense[];
        variableExpenses: VariableExpense[];
    }>;
    getUserExpensesByDate(userId: number, year: number, month?: number, day?: number): Promise<{ user: User | null, fixedExpenses: FixedExpense[], variableExpenses: VariableExpense[] }>;
    getUserExpensesByPeriod(userId: number, startDate: Date, endDate: Date): Promise<{ user: User | null, fixedExpenses: FixedExpense[], variableExpenses: VariableExpense[] }>;
}
