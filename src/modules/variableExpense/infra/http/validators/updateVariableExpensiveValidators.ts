import * as Z from 'zod';

export const variableExpenseSchema = Z.object({
  description: Z.string().min(1, "Description is required"),
  amount: Z.number().positive("Amount must be positive"),
  month: Z.number().min(1).max(12, "Month must be between 1 and 12"),
  year: Z.number(),
  category: Z.string().min(1, "Category is required"),
  createdAt: Z.string().refine((date) => !isNaN(Date.parse(date)), {
    message: "Invalid date format",
  }).optional(),
});