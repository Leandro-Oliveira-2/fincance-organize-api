import { inject, injectable } from "inversify";
import Types from "@/common/container/types";
import { IVariableExpenseRepository } from "../repositorie/IvariableExpenseRepository";
import { InternalServerError } from "@/common/errors/InternalServerError"; // Importar o erro genérico, caso necessário

@injectable()
export class ListVariableExpenseService {
  @inject(Types.VariableExpenseRepository) private variableExpenseRepository!: IVariableExpenseRepository;

  async execute() {
    try {
      const variableExpenses = await this.variableExpenseRepository.getVariableExpenses();

      return {
        message: "Variable expenses retrieved successfully",
        data: variableExpenses,
      };
    } catch (error: any) {
      console.error("Error fetching variable expenses:", error.message);

      throw new InternalServerError("An error occurred while retrieving variable expenses.");
    }
  }
}
