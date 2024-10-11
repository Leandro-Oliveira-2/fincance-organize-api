import { CreditCardBill, Prisma } from "@prisma/client";

export interface ICreditCardBillRepository {

  create(data: Prisma.CreditCardBillCreateInput): Promise<CreditCardBill>;
  updateCreditCardBill(id: number, data: Prisma.CreditCardBillUncheckedUpdateInput): Promise<CreditCardBill | null>;
  findById(id: number): Promise<CreditCardBill | null>;
  findAllByUserId(userId: number): Promise<CreditCardBill[] | []>;
  getAllCreditCardBills(): Promise<CreditCardBill[] | []>;
  delete(id: number): Promise<void>;
}
