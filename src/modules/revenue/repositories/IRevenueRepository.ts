import { Revenue, Prisma } from "@prisma/client";

export interface IRevenueRepository {
    create(data: Prisma.RevenueCreateInput): Promise<Revenue>;
    updateRevenue(id: number, data: Prisma.RevenueUncheckedUpdateInput): Promise<Revenue | null>;
    findById(id: number): Promise<Revenue | null>;
    sumAllByUserId(userId: number): Promise<number>;
    findAllByUserId(userId: number): Promise<Revenue[] | []>;
    getRevenues(): Promise<Revenue[] | []>;
    delete(id: number): Promise<void>;
}