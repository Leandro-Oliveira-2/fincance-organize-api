import { inject, injectable } from "inversify";
import { IRevenueRepository } from "@/modules/revenue/repositories/IRevenueRepository";
import Types from "@/common/container/types";
import { InternalServerError } from "@/common/errors/InternalServerError"; // Importar erros personalizados, se aplicável

@injectable()
export class ListRevenueService {
  constructor(
    @inject(Types.RevenueRepository) private revenueRepository: IRevenueRepository,
  ) {}

  async execute() {
    try {
      // Busca as receitas do repositório
      const revenues = await this.revenueRepository.getRevenues();

      // Retorna as receitas encontradas
      return {
        message: "Revenues retrieved successfully",
        data: revenues,
      };
    } catch (error: any) {
      // Log de erro para facilitar a depuração
      console.error("Error retrieving revenues:", error.message);

      // Tratamento de erro genérico, pode ser substituído por erro customizado
      throw new InternalServerError("An error occurred while retrieving revenues.");
    }
  }
}
