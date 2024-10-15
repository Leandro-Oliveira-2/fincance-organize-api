import { inject, injectable } from "inversify";
import { IRevenueRepository } from "@/modules/revenue/repositories/IRevenueRepository";
import Types from "@/common/container/types";
import { InternalServerError } from "@/common/errors/InternalServerError";

interface IRequest {
  userId: number;
}

@injectable()
export class CalculateRevenueByIdService {
  constructor(
    @inject(Types.RevenueRepository) private revenueRepository: IRevenueRepository,
  ) {}

  public async execute({ userId }: IRequest) {
    try {
      // Soma todas as receitas do usuário
      const totalRevenue = await this.revenueRepository.sumAllByUserId(userId);

      // Retorna o total calculado
      return {
        total: totalRevenue
      };
    } catch (error: any) {
      console.error("Error calculating total revenue:", error.message);
      throw new InternalServerError("An error occurred while calculating total revenue.");
    }
  }
}
