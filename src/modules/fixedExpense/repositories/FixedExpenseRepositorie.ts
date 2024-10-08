import { injectable } from "inversify";
import { Prisma, FixedExpense } from "@prisma/client";
import { IFixedExpenseRepository } from "./IFixedExpenseRepositorie";
import { prisma } from "@/lib/prisma";


@injectable()
export class FixedExpenseRepository implements IFixedExpenseRepository {


    async create(data: Prisma.FixedExpenseCreateInput): Promise<FixedExpense> {
       return await prisma.fixedExpense.create({
            data: data
       })
    }

    async updateFixedExpense(id: number, data: Prisma.FixedExpenseUncheckedUpdateInput): Promise<FixedExpense | null> {
       return await prisma.fixedExpense.update({
            where: {id},
            data: data
       })
    }

    async findById(id: number): Promise<FixedExpense | null> {
       return await prisma.fixedExpense.findUnique({
            where: {id}
       })
    }

    async getFixedExpenses(): Promise<FixedExpense[] | []> {
      return await prisma.fixedExpense.findMany()
    }

    async delete(id: number): Promise<void> {
       await prisma.fixedExpense.delete({
            where: {id}
      })
    }

}