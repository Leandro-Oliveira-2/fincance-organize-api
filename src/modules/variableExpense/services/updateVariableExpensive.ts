import Types from "@/common/container/types";
import { inject, injectable } from "inversify";
import * as Z from "zod";
import { VariableExpensiveDoesNotExist } from "@/modules/variableExpense/errors/VariableExpensiveDoesNotExist";
import { variableExpenseSchema } from "@/modules/variableExpense/infra/http/validators/updateVariableExpensiveValidators";
import { IVariableExpenseRepository } from "@/modules/variableExpense/repositorie/IvariableExpenseRepository";
import { ValidationError } from "@/common/errors/ValidationError"; // Usando erros personalizados
import { InternalServerError } from "@/common/errors/InternalServerError"; // Erro genérico para casos inesperados

interface IRequest {
  id: number;
  data: Z.infer<typeof variableExpenseSchema>;
}

@injectable()
export class UpdateVariableExpenseService {
  @inject(Types.VariableExpenseRepository) private variableExpenseRepository!: IVariableExpenseRepository;

  public async execute({ id, data }: IRequest) {
    try {
      // Validação dos dados da despesa variável (sem o ID)
      const parsedData = variableExpenseSchema.safeParse(data);
      if (!parsedData.success) {
        console.log(`Validation failed for Variable Expense with ID: ${id}`);
        throw new ValidationError("Invalid data format", parsedData.error.errors);
      }

      // Verificar se a despesa variável existe
      const variableExpense = await this.variableExpenseRepository.findById(id);
      if (!variableExpense) {
        throw new VariableExpensiveDoesNotExist("Variable Expense does not exist");
      }

      // Atualizar a despesa variável
      const updateData = {
        description: data.description,
        amount: data.amount,
        month: data.month,
        year: data.year,
      };

      return await this.variableExpenseRepository.updateVariableExpense(id, updateData);
    } catch (error: any) {
      console.error(`Error updating Variable Expense with ID: ${id}:`, error.message);
      throw new InternalServerError("An error occurred while updating the Variable Expense.");
    }
  }
}
