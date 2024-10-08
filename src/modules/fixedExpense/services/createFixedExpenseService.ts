import { inject, injectable } from "inversify";
import { IUserRepository } from "@/modules/user/repositories/IUserRepository";
import Types from "@/common/container/types";
import * as Z from "zod";
import { fixedExpenseSchema } from "@/modules/fixedExpense/infra/validators/createFixedExpenseValidator";
import { IFixedExpenseRepository } from "../repositories/IFixedExpenseRepositorie";

interface IRequest {
  data: Z.infer<typeof fixedExpenseSchema>;
}

@injectable()
export class CreateFixedExpenseService {

  @inject(Types.FixedExpenseRepository) private fixedExpenseRepository!: IFixedExpenseRepository;
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

    const fixedExpense = {
      user: { connect: { id: data.userId } },
      description: data.description,
      amount: data.amount,
      month: data.month,
      year: data.year,
      createdAt: data.createdAt ? new Date(data.createdAt) : undefined,
    };

    return await this.fixedExpenseRepository.create(fixedExpense);
  }
}