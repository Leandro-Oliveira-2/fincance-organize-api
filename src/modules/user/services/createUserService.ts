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
export class CreateUserService {
  @inject(Types.UserRepository)
  private userRepository!: IUserRepository;

  public async execute({ data }: IRequest) {
    try {
      // Criar o objeto de usuário, hash da senha com Argon2
      const user = {
        email: data.email.toLowerCase(),
        name: data.name,
        password: await argon2.hash(data.password),
        birthDate: data.birthDate,
        profession: data.profession,
        salary: data.salary,
        createdAt: data.createdAt ?? new Date(),
        updatedAt: data.updatedAt ?? new Date(),
      };

      // Chama o repositório para criar o usuário
      const newUser = await this.userRepository.create(user);

      return newUser;
    } catch (error) {
      console.error("Error creating user:", error);
      throw new Error("An error occurred while creating the user.");
    }
  }
}
