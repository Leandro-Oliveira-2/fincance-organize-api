import { inject, injectable } from "inversify";
import { IUserRepository } from "@/modules/user/repositories/IUserRepository";
import Types from "@/common/container/types";
import * as Z from "zod";
import { IVariableExpenseRepository } from "../repositorie/IvariableExpenseRepository";
import { variableExpenseSchema } from "../infra/http/validators/createVariableExpensiveValidators";

interface IRequest {
  data: Z.infer<typeof variableExpenseSchema>;
}

@injectable()
export class CreateVariableExpenseService {

  @inject(Types.VariableExpenseRepository) private variableExpenseRepository!: IVariableExpenseRepository;
  @inject(Types.UserRepository) private userRepository!: IUserRepository;

  async execute({ data }: IRequest) {
    // Log the userId being checked
    console.log(`Checking if user with ID ${data.userId} exists`);

    // Check if the user exists
    const userExists = await this.userRepository.findById(data.userId);
    console.log(`User exists: ${userExists !== null}`);
    console.log(`User data: ${JSON.stringify(userExists)}`);

    if (!userExists) {
      throw new Error("User not found");
    }

    const variableExpense = {
      user: { connect: { id: data.userId } },
      description: data.description,
      amount: data.amount,
      month: data.month,
      year: data.year,
      createdAt: data.createdAt ? new Date(data.createdAt) : undefined,
    };

    return await this.variableExpenseRepository.create(variableExpense);
  }
}