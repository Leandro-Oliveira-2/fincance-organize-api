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
      console.log("Validando dados...");
      const parsedData = revenueSchema.safeParse(data);
      if (!parsedData.success) {
        console.error("Erro na validação dos dados:", parsedData.error.errors);
        throw new ValidationError("Invalid data format", parsedData.error.errors);
      }

      console.log("Verificando se o usuário existe...");
      const userExists = await this.userRepository.findById(data.userId);
      if (!userExists) {
        console.error("Usuário não encontrado:", data.userId);
        throw new NotFoundError("User not found");
      }

      
      const startDate = new Date(data.startDate);
      const month = startDate.getMonth() + 1;
      const year = startDate.getFullYear();

      console.log("Criando receita...");
      const revenue = {
        user: { connect: { id: data.userId } },
        source: data.source,
        amount: data.amount,
        startDate: data.startDate, 
        endDate: data.endDate ?? new Date(year, 11, 31), 
        frequency: data.frequency ?? "mensal", 
        isPaid: data.isPaid ?? false,
    };

      console.log("Persistindo receita no banco de dados...");
      const newRevenue = await this.revenueRepository.create(revenue);

      console.log("Receita criada com sucesso:", newRevenue);
      return {
        message: "Revenue created successfully",
        revenue: newRevenue,
      };

    } catch (error: any) {
      console.error("Erro ao criar receita:", error.message);
      if (error instanceof ValidationError || error instanceof NotFoundError) {
        throw error;
      }

      throw new Error("An unexpected error occurred while creating revenue.");
    }
  }
}
