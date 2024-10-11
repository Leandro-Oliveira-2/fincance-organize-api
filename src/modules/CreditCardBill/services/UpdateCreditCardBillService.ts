import { inject, injectable } from "inversify";
import { ICreditCardBillRepository } from "../repositories/ICreditCardBillRepository";
import Types from "@/common/container/types";
import * as Z from "zod";
import { ValidationError } from "@/common/errors/ValidationError";
import { updateCreditCardBillSchema } from "../infra/validators/updateCreditCardBillSchema";
import { CreditCardBillNotFoundError } from "../errors/CreditCardBillNotFoundError";



interface IRequest {
  id: number;
  data: Z.infer<typeof updateCreditCardBillSchema>;
}

@injectable()
export class UpdateCreditCardBillService {
  @inject(Types.CreditCardBillRepository)
  private creditCardBillRepository!: ICreditCardBillRepository;

  public async execute({ id, data }: IRequest) {
    const parsedData = updateCreditCardBillSchema.safeParse(data);
    if (!parsedData.success) {
      throw new ValidationError("Invalid data format", parsedData.error.errors);
    }

    const creditCardBill = await this.creditCardBillRepository.findById(id);
    if (!creditCardBill) {
      throw new CreditCardBillNotFoundError("Credit Card Bill does not exist");
    }

    const updateData = {
      totalAmount: data.totalAmount,
      dueDate: data.dueDate ? new Date(data.dueDate) : undefined,
      isPaid: data.isPaid ?? creditCardBill.isPaid,
    };

    return await this.creditCardBillRepository.updateCreditCardBill(id, updateData);
  }
}
