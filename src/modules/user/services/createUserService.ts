import { inject, injectable } from "inversify";
import { IUserRepository } from "../repositories/IUserRepository";
import Types from "@/common/container/types";
import * as Z from "zod";
import { userSchema } from "../http/validators/createUserValidators";
import argon2 from "argon2";

interface IRequest {
  data: Z.infer<typeof userSchema>;
}

@injectable()
export class createUserService {
    @inject(Types.UserRepository) private userRepository!: IUserRepository;

  async execute(data: IRequest) {
    const user = {
      email: data.data.email.toLowerCase(),
      name: data.data.name,
      password: await argon2.hash(data.data.password),
      birthDate: data.data.birthDate,
      profession: data.data.profession,
      salary: data.data.salary,
      createdAt: data.data.createdAt ?? new Date(),
      updatedAt: data.data.updatedAt ?? new Date(),
    };

    return await this.userRepository.create(user);
  }
}