import { Prisma, CreditCardBill } from "@prisma/client";
import { prisma } from "@/lib/prisma";  // Importando a instância do Prisma Client configurada
import { injectable } from "inversify";
import { ICreditCardBillRepository } from "./ICreditCardBillRepository";

@injectable()
export class CreditCardBillRepository implements ICreditCardBillRepository {
  
  // Cria uma nova fatura de cartão de crédito
  async create(data: Prisma.CreditCardBillCreateInput): Promise<CreditCardBill> {
    return await prisma.creditCardBill.create({
      data: data,
    });
  }

  // Atualiza uma fatura de cartão de crédito existente
  async updateCreditCardBill(id: number, data: Prisma.CreditCardBillUncheckedUpdateInput): Promise<CreditCardBill | null> {
    return await prisma.creditCardBill.update({
      where: { id },
      data: data,
    });
  }

  // Encontra uma fatura de cartão de crédito pelo ID
  async findById(id: number): Promise<CreditCardBill | null> {
    return await prisma.creditCardBill.findUnique({
      where: { id },
    });
  }

  // Encontra todas as faturas de cartão de crédito para um usuário específico
  async findAllByUserId(userId: number): Promise<CreditCardBill[] | []> {
    return await prisma.creditCardBill.findMany({
      where: { userId },
    });
  }

  // Obtém todas as faturas de cartão de crédito
  async getAllCreditCardBills(): Promise<CreditCardBill[] | []> {
    return await prisma.creditCardBill.findMany();
  }

  // Exclui uma fatura de cartão de crédito pelo ID
  async delete(id: number): Promise<void> {
    await prisma.creditCardBill.delete({
      where: { id },
    });
  }
}
