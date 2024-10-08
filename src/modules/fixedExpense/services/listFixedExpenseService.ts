import { inject, injectable } from "inversify";
import Types from "@/common/container/types";
import { IFixedExpenseRepository } from "../repositories/IFixedExpenseRepositorie";

@injectable()
export class ListFixedExpenseService {
    @inject(Types.FixedExpenseRepository) private fixedExpenseRepository!: IFixedExpenseRepository;

  async execute() {
    return await this.fixedExpenseRepository.getFixedExpenses();
  }
}
