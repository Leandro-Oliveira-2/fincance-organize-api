import * as Z from 'zod';

export const revenueSchema = Z.object({
    id: Z.number().optional(),
    userId: Z.number(),
    source: Z.string(),
    amount: Z.number(),
    startDate: Z.string(),
    endDate: Z.string().optional(),
    frequency: Z.enum(["mensal", "semanal", "anual"]).optional(),
    isPaid: Z.boolean().optional(),
});
