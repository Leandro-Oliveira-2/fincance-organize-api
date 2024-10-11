import * as Z from 'zod';

export const userSchema = Z.object({
  email: Z.string().email("Formato de email inválido"),
  password: Z.string().min(6, "A senha deve ter pelo menos 6 caracteres"),
  name: Z.string().min(1, "O nome é obrigatório"),
  birthDate: Z.string().transform((str) => new Date(str)),
  profession: Z.string().optional(),
  createdAt: Z.string().transform((str) => new Date(str)).optional(),
});
