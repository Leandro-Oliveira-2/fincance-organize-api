import Types from "@/common/container/types";
import { inject, injectable } from "inversify";
import * as Z from "zod";
import { IUserRepository } from "@/modules/user/repositories/IUserRepository";
import { FixedExpenseDoesNotExist } from "../errors/FixedExpenseDoesNotExist";
import { fixedExpenseSchema } from "../infra/validators/updateFixedExpenseValidator";
import { IFixedExpenseRepository } from "../repositories/IFixedExpenseRepositorie";

interface IRequest {
  id: number;
  data: Z.infer<typeof fixedExpenseSchema>;
}

@injectable()
export class UpdateFixedExpenseService {
  @inject(Types.FixedExpenseRepository) private fixedExpenseRepository!: IFixedExpenseRepository;

  public async execute({ id, data }: IRequest) {
    console.log(`Updating fixed expense with ID: ${id}`);
    const fixedExpense = await this.fixedExpenseRepository.findById(id);
    console.log(`Fixed expense found: ${fixedExpense !== null}`);

    if (!fixedExpense) {
      throw new FixedExpenseDoesNotExist("Fixed expense does not exist");
    }

    const updateData: any = {
      description: data.description,
      amount: data.amount,
      month: data.month,
      year: data.year,
    };

    return await this.fixedExpenseRepository.updateFixedExpense(id, updateData);
  }
}