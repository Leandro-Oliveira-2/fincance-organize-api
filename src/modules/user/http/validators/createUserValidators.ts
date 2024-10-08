import * as Z from 'zod';

export const userSchema = Z.object({
  email: Z.string().email("Invalid email format"),
  password: Z.string().min(6, "Password must be at least 6 characters"),
  name: Z.string().min(1, "Name is required"),
  birthDate: Z.string().transform((str) => new Date(str)), // Transforma string ISO para Date
  profession: Z.string().optional(),
  salary: Z.number().positive("Salary must be a positive number").optional(),
  createdAt: Z.string().transform((str) => new Date(str)), // Transforma string ISO para Date
  updatedAt: Z.string().transform((str) => new Date(str)), // Transforma string ISO para Date
});
