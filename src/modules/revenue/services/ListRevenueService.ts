import { inject, injectable } from "inversify";
import { IRevenueRepository } from "@/modules/revenue/repositories/IRevenueRepository";
import Types from "@/common/container/types";

@injectable()
export class ListRevenueService {
  constructor(
    @inject(Types.RevenueRepository) private revenueRepository: IRevenueRepository,
  ) {}

  async execute() {
    return await this.revenueRepository.getRevenues();
  }
}
