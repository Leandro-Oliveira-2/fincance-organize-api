import * as Z from 'zod';

export const updateCreditCardBillSchema = Z.object({
    totalAmount: Z.number().positive("Amount must be positive"),
    cardProvider: Z.string().optional(),
    dueDate: Z.string().refine((date) => !isNaN(Date.parse(date)), {
      message: "Invalid date format",
    }),
    isPaid: Z.boolean().optional(),
});
