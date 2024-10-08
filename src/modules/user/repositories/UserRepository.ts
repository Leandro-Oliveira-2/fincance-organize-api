import { Prisma, User } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { injectable } from "inversify";
import { IUserRepository } from "./IUserRepository";

@injectable()
export class UserRepository implements IUserRepository {
  async create(data: Prisma.UserCreateInput): Promise<User> {
    return await prisma.user.create({
      data: data,
    });
  }

  async updateUser(id: number, data: Prisma.UserUncheckedUpdateInput): Promise<User | null> {
    return await prisma.user.update({
      where: { id },
      data: data,
    });
  }

  async findById(id: number): Promise<User | null> {
    return await prisma.user.findUnique({
      where: { id },
    });
  }
  
  async findByEmail(email: string): Promise<User | null> {
    return await prisma.user.findUnique({
      where: { email },
    });
  }

  async getUsers(): Promise<User[] | []> {
    return await prisma.user.findMany();
  }

  async delete(id: number): Promise<void> {
    await prisma.user.delete({
      where: { id },
    });
  }
}
