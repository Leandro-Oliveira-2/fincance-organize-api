import Types from "@/common/container/types";
import { inject, injectable } from "inversify";
import * as Z from "zod";
import { userUpdateSchema } from "../http/validators/updateUserValidator";
import { IUserRepository } from "../repositories/IUserRepository";
import { UserDoesNotExist } from "../errors/UserDoesNotExist";

interface IRequest {
  id: number;
  data: Z.infer<typeof userUpdateSchema>;
}

@injectable()
export class UpdateUserService {
  constructor(
    @inject(Types.UserRepository) private userRepository: IUserRepository
  ) {}

  public async execute({ id, data }: IRequest) {
    console.log("Data:", data);
    const user = await this.userRepository.findById(id);
    if (!user) {
      throw new UserDoesNotExist("User does not exist");
    }

    const updateData: any = {
      name: data.name,
      email: data.email,
      birthDate: data.birthDate,
      profession: data.profession,
      salary: data.salary,
      updatedAt: data.updatedAt ?? new Date(),
    };

    return await this.userRepository.updateUser(id, updateData);
  }
}