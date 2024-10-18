import * as Z from 'zod';

export const fixedExpenseSchema = Z.object({
  userId: Z.number(),
  description: Z.string()
    .min(1, "Description is required")
    .max(100, "Description must be at most 100 characters long"), // Limite de caracteres para a descrição
    amount: Z.number()
    .positive("Amount must be positive")
    .max(999999.99, "Amount must be less than 1,000,000"), // Limite para o valor do amount
  month: Z.number().min(1).max(12, "Month must be between 1 and 12"),
  year: Z.number(),
  category: Z.string().min(1, "Category is required"),
  createdAt: Z.string().refine((date) => !isNaN(Date.parse(date)), {
    message: "Invalid date format",
  }).optional(),
});