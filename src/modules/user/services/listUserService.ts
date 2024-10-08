import { inject, injectable } from "inversify";
import { IUserRepository } from "../repositories/IUserRepository";
import Types from "@/common/container/types";
import { InternalServerError } from "@/common/errors/InternalServerError"; 

@injectable()
export class ListUserService {
  constructor(
    @inject(Types.UserRepository) private userRepository: IUserRepository
  ) {}

  public async execute() {
    try {
      // Chama o repositório para buscar os usuários
      const users = await this.userRepository.getUsers();

      // Retorna os usuários com uma mensagem de sucesso
      return {
        message: "Users retrieved successfully",
        data: users,
      };
    } catch (error: any) {
      console.error("Error retrieving users:", error.message);

      // Lança um erro genérico para ser tratado pelo controlador
      throw new InternalServerError("An error occurred while retrieving users.");
    }
  }
}
