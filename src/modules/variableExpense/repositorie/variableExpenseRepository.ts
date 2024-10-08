import { Prisma, Revenue, VariableExpense } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { injectable } from "inversify";
import { IVariableExpenseRepository } from "./IvariableExpenseRepository";

@injectable()
export class VariableExpenseRepository implements IVariableExpenseRepository {

    async create(data: Prisma.VariableExpenseCreateInput): Promise<VariableExpense> {
        return await prisma.variableExpense.create({
            data: data,
        });
    }

    async delete(id: number): Promise<void> {
        await prisma.variableExpense.delete({
            where: { id },
        });
    }

    async findById(id: number): Promise<VariableExpense | null> {
        return await prisma.variableExpense.findUnique({
            where: { id },
        })
    }

    async findAllByUserId(userId: number): Promise<VariableExpense[] | []> {
        return await prisma.variableExpense.findMany({
            where: { userId },
        });
    }

    async getVariableExpenses(): Promise<VariableExpense[] | []> {
        return await prisma.variableExpense.findMany();
    }

    async updateVariableExpense(id: number, data: Prisma.VariableExpenseUncheckedUpdateInput): Promise<VariableExpense | null> {
      return await prisma.variableExpense.update({
        where: { id },
        data: data,
      })
    }
}