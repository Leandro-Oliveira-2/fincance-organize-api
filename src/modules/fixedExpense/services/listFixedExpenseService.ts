import { inject, injectable } from "inversify";
import Types from "@/common/container/types";
import { IFixedExpenseRepository } from "../repositories/IFixedExpenseRepositorie";
import { InternalServerError } from "@/common/errors/InternalServerError"; // Um erro genérico para casos inesperados

@injectable()
export class ListFixedExpenseService {
  @inject(Types.FixedExpenseRepository)
  private fixedExpenseRepository!: IFixedExpenseRepository;

  async execute() {
    try {
      const fixedExpenses = await this.fixedExpenseRepository.getFixedExpenses();
      
      // Verificar se existem despesas fixas
      if (fixedExpenses.length === 0) {
        return {
          message: "No fixed expenses found",
          data: [],
        };
      }

      // Retorna uma resposta estruturada com sucesso
      return {
        message: "Fixed expenses retrieved successfully",
        data: fixedExpenses,
      };
    } catch (error: any) {
      // Log do erro para facilitar a depuração
      console.error("Error fetching fixed expenses:", error.message);

      // Lança um erro genérico que pode ser capturado pelo handler global
      throw new InternalServerError("An error occurred while retrieving fixed expenses.");
    }
  }
}
