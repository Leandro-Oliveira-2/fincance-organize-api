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
        console.log(`Validation failed for fixed expense with ID: ${id}`);
        throw new ValidationError("Invalid data format", parsedData.error.errors);
      }

      // Verificar se a despesa fixa existe
      console.log(`Checking existence of fixed expense with ID: ${id}`);
      const fixedExpense = await this.fixedExpenseRepository.findById(id);

      if (!fixedExpense) {
        console.log(`Fixed expense with ID: ${id} does not exist`);
        throw new FixedExpenseDoesNotExist("Fixed expense does not exist");
      }

      // Preparar os dados para atualização
      const updateData = {
        description: data.description,
        amount: data.amount,
        month: data.month,
        year: data.year,
      };

      console.log(`Updating fixed expense with ID: ${id}`);
      const updatedFixedExpense = await this.fixedExpenseRepository.updateFixedExpense(id, updateData);

      // Retorno de sucesso padronizado
      return {
        message: "Fixed expense updated successfully",
        data: updatedFixedExpense,
      };
      
    } catch (error: any) {
      // Log do erro
      console.error(`Error updating fixed expense with ID: ${id}:`, error.message);

      // Tratamento de erros conhecidos
      if (error instanceof ValidationError || error instanceof FixedExpenseDoesNotExist) {
        throw error;
      }

      // Tratamento genérico para erros inesperados
      throw new InternalServerError("An error occurred while updating the fixed expense.");
    }
  }
}
