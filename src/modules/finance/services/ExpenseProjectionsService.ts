import Types from "@/common/container/types";
import { inject, injectable } from "inversify";
import { IFinanceRepository } from "../repositories/IFinanceRepository";
import { IResponse } from "../responses/ProjectionReponse"; 

interface IRequest {
  userId: number;
  year: number;
}


@injectable()
export class ExpenseProjectionsService {
  @inject(Types.FinanceRepository) private financeRepository!: IFinanceRepository;

  
  async execute({ userId, year }: IRequest): Promise<IResponse> {
    const result = await this.financeRepository.projectExpensesForYear(
      userId,
      year,
    );


    return result;
  }
}
