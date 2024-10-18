import * as Z from 'zod';

export const variableExpenseSchema = Z.object({
  description: Z.string().min(1, "Description is required").optional(),
  amount: Z.number().positive("Amount must be positive").optional(),
  month: Z.number().min(1).max(12, "Month must be between 1 and 12").optional(),
  category: Z.string().min(1, "Category is required").optional(),
  year: Z.number().optional(),
  createdAt: Z.string().refine((date) => !isNaN(Date.parse(date)), {
    message: "Invalid date format",
  }).optional(),
});