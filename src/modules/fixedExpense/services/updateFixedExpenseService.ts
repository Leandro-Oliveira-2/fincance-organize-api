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
  data: Z.infer<typeof fixedExpenseSchema>;
}

@injectable()
export class UpdateFixedExpenseService {
  @inject(Types.FixedExpenseRepository)
  private fixedExpenseRepository!: IFixedExpenseRepository;

  public async execute({ id, data }: IRequest) {
    try {
      // Validação dos dados de entrada
      const parsedData = fixedExpenseSchema.safeParse(data);
      if (!parsedData.success) {
        console.error(`Validation errors:`, parsedData.error.errors); // Log detalhado de erros de validação
        throw new ValidationError("Invalid data format", parsedData.error.errors);
      }

      // Verificar se a despesa fixa existe
      const fixedExpense = await this.fixedExpenseRepository.findById(id);

      if (!fixedExpense) {
        throw new FixedExpenseDoesNotExist("Fixed expense does not exist");
      }

      // Preparar os dados para atualização (somente campos que estão no esquema)
      const updateData = {
        description: data.description,
        amount: data.amount,
        month: data.month,
        category: data.category,
        year: data.year,
      };

      const updatedFixedExpense = await this.fixedExpenseRepository.updateFixedExpense(id, updateData);

      // Retorno de sucesso padronizado
      return {
        message: "Fixed expense updated successfully",
        data: updatedFixedExpense,
      };
      
    } catch (error: any) {
      // Log do erro com detalhes e stack trace
      console.error(`Error updating fixed expense with ID: ${id}:`, error.message, error.stack);

      // Tratamento de erros conhecidos
      if (error instanceof ValidationError || error instanceof FixedExpenseDoesNotExist) {
        throw error;
      }

      // Tratamento genérico para erros inesperados
      throw new InternalServerError("An error occurred while updating the fixed expense.");
    }
  }
}
