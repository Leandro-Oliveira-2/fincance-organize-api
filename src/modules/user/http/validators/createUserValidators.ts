import * as Z from 'zod';

export const userSchema = Z.object({
    id: Z.number().optional(),
    email: Z.string().email(),
    password: Z.string().min(6).max(255),
    name: Z.string().min(3).max(255),
    birthDate: Z.string().transform((str) => new Date(str)),
    profession: Z.string().optional(),
    salary: Z.number().optional(),
    createdAt: Z.date().optional(),
    updatedAt: Z.date().optional(),
});