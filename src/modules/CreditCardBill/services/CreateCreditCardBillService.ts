import { inject, injectable } from "inversify";
import { ICreditCardBillRepository } from "../repositories/ICreditCardBillRepository";
import Types from "@/common/container/types";
import * as Z from "zod";
import { ValidationError } from "@/common/errors/ValidationError"; // Usando erro customizado
import { createCreditCardBillSchema } from "../infra/validators/createCreditCardBillValidator";

interface IRequest {
  data: Z.infer<typeof createCreditCardBillSchema>;
}

@injectable()
export class CreateCreditCardBillService {
  @inject(Types.CreditCardBillRepository) private creditCardBillRepository!: ICreditCardBillRepository;

  public async execute({ data }: IRequest) {
    // Validação dos dados recebidos
    const parsedData = createCreditCardBillSchema.safeParse(data);
    if (!parsedData.success) {
      throw new ValidationError("Invalid data format", parsedData.error.errors);
    }

    const { userId, totalAmount, dueDate, isPaid } = data;

    const creditCardBill = {
      user: { connect: { id: userId } },
      totalAmount,
      dueDate: new Date(dueDate),
      isPaid: isPaid ?? false,
    };

    return await this.creditCardBillRepository.create(creditCardBill);
  }
}
