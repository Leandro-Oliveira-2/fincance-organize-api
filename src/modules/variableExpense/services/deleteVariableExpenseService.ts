import Types from "@/common/container/types";
import { inject, injectable } from "inversify";
import * as Z from "zod";
import { IVariableExpenseRepository } from "../repositorie/IvariableExpenseRepository";
import { variableExpenseSchema } from "../infra/http/validators/createVariableExpensiveValidators";
import { ValidationError } from "@/common/errors/ValidationError"; // Usando erros personalizados
import { InternalServerError } from "@/common/errors/InternalServerError";
import { VariableExpensiveDoesNotExist } from "../errors/VariableExpensiveDoesNotExist";

interface IRequest {
  id: number;
}

@injectable()
export class DeleteVariableExpenseService {
  @inject(Types.VariableExpenseRepository)private variableExpenseRepository!: IVariableExpenseRepository;

  public async execute({ id }: IRequest) {
    try {

     
      const fixedExpense = await this.variableExpenseRepository.findById(id);

      if (!fixedExpense) {
        throw new VariableExpensiveDoesNotExist("Fixed expense does not exist");
      }

     return await this.variableExpenseRepository.delete(id);
      
    } catch (error: any) {
        // Log do erro com detalhes e stack trace
        console.error(`Error deleting fixed expense with ID: ${id}:`, error.message, error.stack);
  
        // Tratamento de erros conhecidos
        if (error instanceof ValidationError || error instanceof VariableExpensiveDoesNotExist) {
          throw error;
        }
  
        // Tratamento genérico para erros inesperados
        throw new InternalServerError("An error occurred while deleting the fixed expense.");
      }
  }
}
