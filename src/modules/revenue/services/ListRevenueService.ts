import { inject, injectable } from "inversify";
import { IRevenueRepository } from "@/modules/revenue/repositories/IRevenueRepository";
import Types from "@/common/container/types";
import { InternalServerError } from "@/common/errors/InternalServerError"; // Importar erros personalizados, se aplicável

@injectable()
export class ListRevenueService {
  @inject(Types.RevenueRepository) private revenueRepository!: IRevenueRepository
  
  async execute() {
    try {
      const revenues = await this.revenueRepository.getRevenues();

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
