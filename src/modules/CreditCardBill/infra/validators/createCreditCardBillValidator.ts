import * as Z from 'zod';

export const createCreditCardBillSchema = Z.object({
    userId: Z.number(),
    totalAmount: Z.number().positive("Amount must be positive"),
    dueDate: Z.string().refine((date) => !isNaN(Date.parse(date)), {
      message: "Invalid date format",
    }),
    isPaid: Z.boolean().optional(),
});
