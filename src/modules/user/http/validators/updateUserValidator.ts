import * as Z from 'zod';

export const userUpdateSchema = Z.object({
    name: Z.string().min(3).max(255).optional(),
    email: Z.string().email().optional(),
    birthDate: Z.date().optional(),
    profession: Z.string().optional(),
    salary: Z.number().optional(),
    updatedAt: Z.date().optional(),
});