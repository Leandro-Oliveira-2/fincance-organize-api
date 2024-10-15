import * as Z from 'zod';

export const revenueSchema = Z.object({
  source: Z.string().nonempty("Source is required"),  // Alterado de 'description' para 'source'
  amount: Z.number().positive("Amount must be positive"),
  userId: Z.number().optional(), // userId pode ser opcional
});
