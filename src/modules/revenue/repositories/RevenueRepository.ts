import { Prisma, Revenue } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { injectable } from "inversify";
import { IRevenueRepository } from "./IRevenueRepository";

@injectable()
export class RevenueRepository implements IRevenueRepository {

  async create(data: Prisma.RevenueCreateInput): Promise<Revenue> {
    return await prisma.revenue.create({
      data: data,
    });
  }

  async updateRevenue(id: number, data: Prisma.RevenueUncheckedUpdateInput): Promise<Revenue | null> {
    return await prisma.revenue.update({
      where: { id },
      data: data,
    });
  }

  async findById(id: number): Promise<Revenue | null> {
    console.log(`Finding revenue with ID: ${id}`);
    return await prisma.revenue.findUnique({
      where: { id },
    });
  }

  async findAllByUserId(userId: number): Promise<Revenue[] | []> {
    try {
      return await prisma.revenue.findMany({
        where: { userId },
      });
    } catch (error) {
      console.error("Error fetching revenues by userId:", error);
      throw new Error("Failed to fetch revenues for user");
    }
  }

  async sumAllByUserId(userId: number): Promise<number> {
    try {
      const result = await prisma.revenue.aggregate({
        _sum: {
          amount: true, // Supondo que "amount" é o campo que armazena o valor da receita
        },
        where: {
          userId: userId, // Somente receitas do usuário específico
        },
      });

      return result._sum.amount || 0; // Retorna a soma ou 0 se não houver receitas
    } catch (error) {
      console.error("Error summing revenues by userId:", error);
      throw new Error("Failed to sum revenues for user");
    }
  }
  

  async getRevenues(): Promise<Revenue[] | []> {
    return await prisma.revenue.findMany();
  }

  async delete(id: number): Promise<void> {
    await prisma.revenue.delete({
      where: { id },
    });
  }
}