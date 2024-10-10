import Types from "@/common/container/types";
import { inject, injectable } from "inversify";
import { IFinanceRepository } from "../repositories/IFinanceRepository";
import { IResponse } from "../responses/CalculateTotalResponse"; 

interface IRequest {
  userId: number;
  year: number;
  startMonth?: number;
  numberOfMonths?: number;
  startDate?: Date;
  endDate?: Date;
}

@injectable()
export class CalculateExpensesService {
  @inject(Types.FinanceRepository) private financeRepository!: IFinanceRepository;

  
  async execute({ userId, year, startMonth, numberOfMonths, startDate, endDate }: IRequest): Promise<IResponse> {
    const result = await this.financeRepository.calculateExpenses(
      userId,
      year,
      startMonth,
      numberOfMonths,
      startDate,
      endDate
    );

    // Retornando a resposta formatada
    const response: IResponse = {
      fixed: result.fixed,
      variable: result.variable,
      total: result.total,
    };

    return response;
  }
}
