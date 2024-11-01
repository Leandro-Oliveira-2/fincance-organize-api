import Types from "@/common/container/types";
import { inject, injectable } from "inversify";
import * as Z from "zod";
import { userUpdateSchema } from "../http/validators/updateUserValidator";
import { IUserRepository } from "../repositories/IUserRepository";
import { UserDoesNotExist } from "../errors/UserDoesNotExist";
import { ValidationError } from "@/common/errors/ValidationError"; 
import { InternalServerError } from "@/common/errors/InternalServerError"; 

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
    try {
      // Valida os dados usando o Zod
      const parsedData = userUpdateSchema.safeParse(data);
      if (!parsedData.success) {
        throw new ValidationError("Invalid data format", parsedData.error.errors);
      }

      // Verifica se o usuário com o ID fornecido existe
      const user = await this.userRepository.findById(id);
      if (!user) {
        throw new UserDoesNotExist("User does not exist");
      }

      // Preparar os dados para atualização
      const updateData = {
        name: parsedData.data.name ?? user.name,
        email: parsedData.data.email ?? user.email,
        birthDate: parsedData.data.birthDate ?? user.birthDate,
        profession: parsedData.data.profession ?? user.profession,
        updatedAt: new Date(), // Atualizado automaticamente com a data atual
      };

      // Atualizar o usuário no repositório
      const updatedUser = await this.userRepository.updateUser(id, updateData);

      // Retorna o usuário atualizado
      return updatedUser;
    } catch (error: any) {
      console.error("Error updating user:", error.message);

      // Lança erros conhecidos
      if (error instanceof ValidationError || error instanceof UserDoesNotExist) {
        throw error;
      }

      // Lança um erro genérico para problemas inesperados
      throw new InternalServerError("An unexpected error occurred while updating the user.");
    }
  }
}
