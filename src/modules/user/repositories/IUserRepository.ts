import { User, Prisma } from "@prisma/client";

export interface IUserRepository {
    create(data: Prisma.UserCreateInput): Promise<User>
    updateUser(id:number, data: Prisma.UserUncheckedUpdateInput): Promise<User | null>
    findById(id: number): Promise<User | null>;
    findByEmail(email: string): Promise<User | null>
    getUsers(): Promise<User[] | []>
    delete(id: number): Promise<void>
}