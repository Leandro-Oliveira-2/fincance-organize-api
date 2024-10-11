import Types from "@/common/container/types";
import { inject, injectable } from "inversify";
import { IFinanceRepository } from "../repositories/IFinanceRepository";
import { IResponse } from "../responses/GetExpensesByPeriodResponse";

interface IRequest {
    userId: string;
    startDate: Date;
    endDate: Date;
}


@injectable()
export class GetExpensesByPeriodService {
    @inject(Types.FinanceRepository) private financeRepository!: IFinanceRepository;

    async execute({ userId, startDate, endDate }: IRequest): Promise<IResponse> {
        const data = await this.financeRepository.getUserExpensesByPeriod(Number(userId), startDate, endDate);

        if (!data.user) {
            throw new Error("User not found");
        }

        const response: IResponse = {
            user: {
                id: data.user.id,
                name: data.user.name,
                email: data.user.email,
                profession: data.user.profession?? '',
                createdAt: data.user.createdAt,
                updatedAt: data.user.updatedAt,
            },
            fixedExpenses: data.fixedExpenses.map(expense => ({
                description: expense.description,
                amount: expense.amount,
                createdAt: expense.createdAt,
            })),
            variableExpenses: data.variableExpenses.map(expense => ({
                description: expense.description,
                amount: expense.amount,
                createdAt: expense.createdAt,
            })),
        };

        return response;
    }
}
