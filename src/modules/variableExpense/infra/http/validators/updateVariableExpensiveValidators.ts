import * as Z from 'zod';

export const variableExpenseSchema = Z.object({
  userId: Z.number(),
  description: Z.string().min(1, "Description is required"),
  amount: Z.number().positive("Amount must be positive"),
  month: Z.number().min(1).max(12, "Month must be between 1 and 12"),
  year: Z.number(),
  createdAt: Z.string().refine((date) => !isNaN(Date.parse(date)), {
    message: "Invalid date format",
  }).optional(),
});