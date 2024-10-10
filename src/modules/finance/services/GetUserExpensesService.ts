import Types from "@/common/container/types";
import { inject, injectable } from "inversify";
import { IFinanceRepository } from "../repositories/IFinanceRepository";
import { User, FixedExpense, VariableExpense } from "@prisma/client";
import { IResponse } from "../responses/GetExpensesByPeriodResponse";

@injectable()
export class GetUserExpensesService {
    @inject(Types.FinanceRepository) private financeRepository!: IFinanceRepository;

    async execute(userId: number): Promise<IResponse> {
        const data = await this.financeRepository.getUserExpenses(userId);

        if (!data.user) {
            throw new Error("User not found");
        }

        const response: IResponse = {
            user: {
                id: data.user.id,
                name: data.user.name,
                email: data.user.email,
                salary: data.user.salary ?? 0,
                profession: data.user.profession ?? '',
                createdAt: data.user.createdAt,
                updatedAt: data.user.updatedAt,
            },
            fixedExpenses: data.fixedExpenses.map((expense: FixedExpense) => ({
                description: expense.description,
                amount: expense.amount,
                createdAt: expense.createdAt,
            })),
            variableExpenses: data.variableExpenses.map((expense: VariableExpense) => ({
                description: expense.description,
                amount: expense.amount,
                createdAt: expense.createdAt,
            })),
        };

        return response;
    }
}
