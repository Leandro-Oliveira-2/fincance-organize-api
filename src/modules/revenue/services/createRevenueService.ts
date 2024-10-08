import { inject, injectable } from "inversify";
import { IRevenueRepository } from "@/modules/revenue/repositories/IRevenueRepository";
import { IUserRepository } from "@/modules/user/repositories/IUserRepository";
import Types from "@/common/container/types";
import * as Z from "zod";
import { revenueSchema } from "@/modules/revenue/infra/http/validators/createRevenueValidators";

interface IRequest {
  data: Z.infer<typeof revenueSchema>;
}

@injectable()
export class CreateRevenueService {

  @inject(Types.RevenueRepository) private revenueRepository!: IRevenueRepository;
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

    const revenue = {
      user: { connect: { id: data.userId } },
      source: data.source,
      amount: data.amount,
      month: data.month,
      year: data.year
    };

    return await this.revenueRepository.create(revenue);
  }
}