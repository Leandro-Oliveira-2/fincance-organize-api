import Types from "@/common/container/types";
import { inject, injectable } from "inversify";
import * as Z from "zod";
import { FixedExpenseDoesNotExist } from "../errors/FixedExpenseDoesNotExist";
import { fixedExpenseSchema } from "../infra/validators/updateFixedExpenseValidator";
import { IFixedExpenseRepository } from "../repositories/IFixedExpenseRepositorie";
import { ValidationError } from "@/common/errors/ValidationError"; // Usando erros personalizados
import { InternalServerError } from "@/common/errors/InternalServerError";

interface IRequest {
  id: number;
}

@injectable()
export class DeleteFixedExpenseService {
  @inject(Types.FixedExpenseRepository)private fixedExpenseRepository!: IFixedExpenseRepository;

  public async execute({ id }: IRequest) {
    try {

     
      const fixedExpense = await this.fixedExpenseRepository.findById(id);

      if (!fixedExpense) {
        throw new FixedExpenseDoesNotExist("Fixed expense does not exist");
      }

     return await this.fixedExpenseRepository.delete(id);
      
    } catch (error: any) {
        // Log do erro com detalhes e stack trace
        console.error(`Error deleting fixed expense with ID: ${id}:`, error.message, error.stack);
  
        // Tratamento de erros conhecidos
        if (error instanceof ValidationError || error instanceof FixedExpenseDoesNotExist) {
          throw error;
        }
  
        // Tratamento genérico para erros inesperados
        throw new InternalServerError("An error occurred while deleting the fixed expense.");
      }
  }
}
