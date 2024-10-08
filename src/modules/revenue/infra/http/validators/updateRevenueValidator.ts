import * as Z from 'zod';

export const revenueSchema = Z.object({
    description: Z.string().nonempty("Description is required"), // Alterado de source para description
    amount: Z.number().positive("Amount must be positive"),
    month: Z.number().int().min(1).max(12, "Month must be between 1 and 12"),
    year: Z.number().int().positive("Year must be a positive integer"),
    userId: Z.number().optional(), // Adicionando userId como opcional
});
