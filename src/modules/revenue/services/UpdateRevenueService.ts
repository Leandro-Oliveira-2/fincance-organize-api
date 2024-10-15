import Types from "@/common/container/types";
import { inject, injectable } from "inversify";
import * as Z from "zod";
import { revenueSchema } from "@/modules/revenue//infra/http/validators/updateRevenueValidator";
import { IRevenueRepository } from "../repositories/IRevenueRepository";
import { RevenueDoesNotExist } from "../errors/RevenueDoesNotExist";

interface IRequest {
  id: number;
  data: Z.infer<typeof revenueSchema>;
}

@injectable()
export class UpdateRevenueService {
  @inject(Types.RevenueRepository) private revenueRepository!: IRevenueRepository;

  public async execute({ id, data }: IRequest) {
    console.log(`Updating revenue with ID: ${id}`);
    
    // Verificar se a receita existe
    const revenue = await this.revenueRepository.findById(id);
    console.log(`Revenue found: ${revenue !== null}`);

    if (!revenue) {
      throw new RevenueDoesNotExist("Revenue does not exist");
    }

    // Preparar os dados para atualização
    const updateData = {
      source: data.source,  // Alterado de 'description' para 'source'
      amount: data.amount,
    };

    // Atualizar a receita
    return await this.revenueRepository.updateRevenue(id, updateData);
  }
}
