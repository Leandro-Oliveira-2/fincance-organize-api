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

  async getRevenues(): Promise<Revenue[] | []> {
    return await prisma.revenue.findMany();
  }

  async delete(id: number): Promise<void> {
    await prisma.revenue.delete({
      where: { id },
    });
  }
}