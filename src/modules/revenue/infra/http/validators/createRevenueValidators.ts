import * as Z from 'zod';

export const revenueSchema = Z.object({
    id: Z.number().optional(),
    userId: Z.number(),
    source: Z.string().min(1, "Description is required")
    .max(100, "Description must be at most 100 characters long"), // Limite de caracteres para a descrição,
    amount: Z.number()
    .positive("Amount must be positive")
    .max(999999.99, "Amount must be less than 1,000,000"), // Limite para o valor do amount
    startDate: Z.string(),
    endDate: Z.string().optional(),
    frequency: Z.enum(["mensal", "semanal", "anual"]).optional(),
    isPaid: Z.boolean().optional(),
});
