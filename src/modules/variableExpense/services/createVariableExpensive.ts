import { inject, injectable } from "inversify";
import { IUserRepository } from "@/modules/user/repositories/IUserRepository";
import Types from "@/common/container/types";
import * as Z from "zod";
import { IVariableExpenseRepository } from "../repositorie/IvariableExpenseRepository";
import { variableExpenseSchema } from "../infra/http/validators/createVariableExpensiveValidators";
import { NotFoundError } from "@/common/errors/NotFoundError";
import { ValidationError } from "@/common/errors/ValidationError";

interface IRequest {
  data: Z.infer<typeof variableExpenseSchema>;
}

@injectable()
export class CreateVariableExpenseService {

  @inject(Types.VariableExpenseRepository) private variableExpenseRepository!: IVariableExpenseRepository;
  @inject(Types.UserRepository) private userRepository!: IUserRepository;

  async execute({ data }: IRequest) {
    console.log(`Checking if user with ID ${data.userId} exists`);

    const userExists = await this.userRepository.findById(data.userId);
    if (!userExists) {
      console.log(`User with ID ${data.userId} not found`);
      throw new NotFoundError("User not found");
    }

    const variableExpense = {
      user: { connect: { id: data.userId } },
      description: data.description,
      amount: data.amount,
      month: data.month,
      year: data.year,
      createdAt: data.createdAt ? new Date(data.createdAt) : undefined,
    };

    console.log(`Creating variable expense for user ID ${data.userId}`);
    const newExpense = await this.variableExpenseRepository.create(variableExpense);

    return {
      message: "Variable expense created successfully",
      data: newExpense,
    };
  }
}
