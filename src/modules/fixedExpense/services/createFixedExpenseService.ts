import { inject, injectable } from "inversify";
import { IUserRepository } from "@/modules/user/repositories/IUserRepository";
import Types from "@/common/container/types";
import * as Z from "zod";
import { fixedExpenseSchema } from "@/modules/fixedExpense/infra/validators/createFixedExpenseValidator";
import { IFixedExpenseRepository } from "../repositories/IFixedExpenseRepositorie";
import { NotFoundError } from "@/common/errors/NotFoundError";
import { ValidationError } from "@/common/errors/ValidationError";

interface IRequest {
  data: Z.infer<typeof fixedExpenseSchema>;
}

@injectable()
export class CreateFixedExpenseService {
  @inject(Types.FixedExpenseRepository)private fixedExpenseRepository!: IFixedExpenseRepository;
  @inject(Types.UserRepository)private userRepository!: IUserRepository;

  async execute({ data }: IRequest) {
    try {
      // Validar os dados usando o schema Zod
      const parsedData = fixedExpenseSchema.safeParse(data);

      if (!parsedData.success) {
        throw new ValidationError("Invalid data format", parsedData.error.errors);
      }

      // Verificar se o usuário existe
      const userExists = await this.userRepository.findById(data.userId);
      if (!userExists) {
        throw new NotFoundError("User not found");
      }

      // Preparar a criação da despesa fixa
      const fixedExpense = {
        user: { connect: { id: data.userId } },
        description: data.description,
        amount: data.amount,
        month: data.month,
        year: data.year,
        createdAt: data.createdAt ? new Date(data.createdAt) : undefined,
      };

      // Criar a despesa fixa
      const newFixedExpense = await this.fixedExpenseRepository.create(fixedExpense);

      // Retornar a nova despesa criada com sucesso
      return {
        message: "Fixed expense created successfully",
        fixedExpense: newFixedExpense,
      };

    } catch (error: any) {
      // Melhor tratamento de erros com log estruturado
      console.error("Error creating fixed expense:", error.message);

      // Lançar erro estruturado para o controlador capturar
      if (error instanceof ValidationError || error instanceof NotFoundError) {
        throw error;
      }

      throw new Error("An unexpected error occurred while creating fixed expense.");
    }
  }
}
