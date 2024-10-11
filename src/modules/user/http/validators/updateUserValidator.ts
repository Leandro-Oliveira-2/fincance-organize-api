import * as Z from 'zod';

export const userUpdateSchema = Z.object({
    name: Z.string().min(3).max(255).optional(),
    email: Z.string().email().optional(),
    birthDate: Z.string().transform((str) => new Date(str)).optional(), 
    profession: Z.string().optional(),
});
