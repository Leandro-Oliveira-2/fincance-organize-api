import { inject, injectable } from "inversify";
import { ICreditCardBillRepository } from "../repositories/ICreditCardBillRepository";
import Types from "@/common/container/types";
import { InternalServerError } from "@/common/errors/InternalServerError";

interface IRequest {
  userId?: number;
}

@injectable()
export class ListCreditCardBillsService {
  @inject(Types.CreditCardBillRepository)
  private creditCardBillRepository!: ICreditCardBillRepository;

  public async execute({ userId }: IRequest) {
    try {
      let bills;

      if (userId) {
        // Busca todas as faturas de cartão de crédito do usuário específico
        bills = await this.creditCardBillRepository.findAllByUserId(userId);
      } else {
        // Busca todas as faturas de cartão de crédito
        bills = await this.creditCardBillRepository.getAllCreditCardBills();
      }

      return bills;
    } catch (error: any) {
      console.error("Error retrieving credit card bills:", error.message);
      throw new InternalServerError("An error occurred while retrieving credit card bills.");
    }
  }
}
