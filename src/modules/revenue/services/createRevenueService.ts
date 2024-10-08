import { inject, injectable } from "inversify";
import { IRevenueRepository } from "@/modules/revenue/repositories/IRevenueRepository";
import { IUserRepository } from "@/modules/user/repositories/IUserRepository";
import Types from "@/common/container/types";
import * as Z from "zod";
import { revenueSchema } from "@/modules/revenue/infra/http/validators/createRevenueValidators";
import { NotFoundError } from "@/common/errors/NotFoundError";
import { ValidationError } from "@/common/errors/ValidationError";

interface IRequest {
  data: Z.infer<typeof revenueSchema>;
}

@injectable()
export class CreateRevenueService {

  @inject(Types.RevenueRepository) private revenueRepository!: IRevenueRepository;
  @inject(Types.UserRepository) private userRepository!: IUserRepository;

  public async execute({ data }: IRequest) {
    try {
      // Validação dos dados usando o schema Zod
      const parsedData = revenueSchema.safeParse(data);
      if (!parsedData.success) {
        throw new ValidationError("Invalid data format", parsedData.error.errors);
      }

      // Verificar se o usuário existe
      console.log(`Checking if user with ID ${data.userId} exists`);
      const userExists = await this.userRepository.findById(data.userId);
      if (!userExists) {
        throw new NotFoundError("User not found");
      }

      // Criar a receita
      const revenue = {
        user: { connect: { id: data.userId } },
        source: data.source,
        amount: data.amount,
        month: data.month,
        year: data.year,
      };

      // Persistir a receita no banco de dados
      const newRevenue = await this.revenueRepository.create(revenue);

      // Retornar a receita criada
      return {
        message: "Revenue created successfully",
        revenue: newRevenue,
      };

    } catch (error: any) {
      console.error("Error creating revenue:", error.message);

      if (error instanceof ValidationError || error instanceof NotFoundError) {
        throw error; // Lança o erro específico para ser capturado pelo controlador
      }

      throw new Error("An unexpected error occurred while creating revenue.");
    }
  }
}
