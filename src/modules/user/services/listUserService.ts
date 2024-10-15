import { inject, injectable } from "inversify";
import { IUserRepository } from "../repositories/IUserRepository";
import Types from "@/common/container/types";
import { InternalServerError } from "@/common/errors/InternalServerError";

@injectable()
export class ListUserService {
  constructor(
    @inject(Types.UserRepository) private userRepository: IUserRepository
  ) {}

  public async execute() {
    try {
      const users = await this.userRepository.getUsers();

      return users;
    } catch (error: any) {
      console.error("Error retrieving users:", error.message);

      throw new InternalServerError(
        "An error occurred while retrieving users."
      );
    }
  }
}
