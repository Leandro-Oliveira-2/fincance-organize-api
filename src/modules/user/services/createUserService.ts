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
  @inject(Types.UserRepository) private userRepository!: IUserRepository;

  public async execute({ data }: IRequest) {
    try {
      const existingUser = await this.userRepository.findByEmail(data.email.toLowerCase());

      if (existingUser) {
        throw new Error("Este email já está em uso.");
      }
      
      const user = {
        email: data.email.toLowerCase(),
        name: data.name,
        password: await argon2.hash(data.password),
        birthDate: data.birthDate,
        profession: data.profession,
        gender: data.gender,
        createdAt: data.createdAt ?? new Date(),
      };

      const newUser = await this.userRepository.create(user);

      return newUser;
    } catch (error) {
      console.error("Erro ao criar usuário:", error);
      throw new Error("Ocorreu um erro ao criar o usuário.");
    }
  }
}
