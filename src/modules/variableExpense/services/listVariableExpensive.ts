import { inject, injectable } from "inversify";
import Types from "@/common/container/types";
import { IVariableExpenseRepository } from "../repositorie/IvariableExpenseRepository";

@injectable()
export class ListVariableExpenseService {
    @inject(Types.VariableExpenseRepository) private variableExpenseRepository!: IVariableExpenseRepository;

  async execute() {
    return await this.variableExpenseRepository.getVariableExpenses();
  }
}
