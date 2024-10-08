import Types from "@/common/container/types";
import { inject, injectable } from "inversify";
import * as Z from "zod";
import { revenueSchema } from "../http/validators/updateRevenueValidator";
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
    const revenue = await this.revenueRepository.findById(id);
    console.log(`Revenue found: ${revenue !== null}`);

    if (!revenue) {
      throw new RevenueDoesNotExist("Revenue does not exist");
    }

    const updateData: any = {
      source: data.source,
      amount: data.amount,
      month: data.month,
      year: data.year,
    };

    return await this.revenueRepository.updateRevenue(id, updateData);
  }
}