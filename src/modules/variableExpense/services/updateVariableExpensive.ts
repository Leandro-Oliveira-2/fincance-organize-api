import Types from "@/common/container/types";
import { inject, injectable } from "inversify";
import * as Z from "zod";
import { VariableExpensiveDoesNotExist } from "@/modules/variableExpense/errors/VariableExpensiveDoesNotExist";
import { variableExpenseSchema } from "@/modules/variableExpense/infra/http/validators/createVariableExpensiveValidators";
import { IVariableExpenseRepository } from "@/modules/variableExpense/repositorie/IvariableExpenseRepository";

interface IRequest {
  id: number;
  data: Z.infer<typeof variableExpenseSchema>;
}

@injectable()
export class UpdateVariableExpenseService {
  @inject(Types.VariableExpenseRepository) private variableExpenseRepository!: IVariableExpenseRepository;

  public async execute({ id, data }: IRequest) {
    console.log(`Updating Variable Expense with ID: ${id}`);
    const variableExpense = await this.variableExpenseRepository.findById(id);
    console.log(`Variable Expense found: ${variableExpense !== null}`);

    if (!variableExpense) {
      throw new VariableExpensiveDoesNotExist("Variable Expense does not exist");
    }

    const updateData: any = {
      description: data.description,
      amount: data.amount,
      month: data.month,
      year: data.year,
    };

    return await this.variableExpenseRepository.updateVariableExpense(id, updateData);
  }
}