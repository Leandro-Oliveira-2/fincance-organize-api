import { inject, injectable } from "inversify";
import { IRevenueRepository } from "@/modules/revenue/repositories/IRevenueRepository";
import Types from "@/common/container/types";
import { InternalServerError } from "@/common/errors/InternalServerError"; // Importar erros personalizados, se aplicável

interface IRequest {
  userId: number;
}

@injectable()
export class GetAllByUserIdService {
    @inject(Types.RevenueRepository) private revenueRepository!: IRevenueRepository

  public async execute({ userId }: IRequest) {
    try {
      // Busca as receitas do repositório (filtrando por mês ou ano, se necessário)
      const revenues = await this.revenueRepository.findAllByUserId(userId);

      return {
        message: "Revenues retrieved successfully",
        data: revenues,
      };
    } catch (error: any) {
      console.error("Error retrieving revenues:", error.message);
      throw new InternalServerError(
        "An error occurred while retrieving revenues."
      );
    }
  }
}
