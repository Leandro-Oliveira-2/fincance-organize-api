import * as Z from 'zod';

export const revenueSchema = Z.object({
    id: Z.number().optional(),
    userId: Z.number(),
    source: Z.string(),
    amount: Z.number(),
    month: Z.number().min(1).max(12),
    year: Z.number()
});