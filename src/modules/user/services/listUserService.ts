import { inject, injectable } from "inversify";
import { IUserRepository } from "../repositories/IUserRepository";
import Types from "@/common/container/types";



@injectable()
export class ListUserService {
  constructor( @inject(Types.UserRepository) private userRepository: IUserRepository) {}

  async execute() {
    return await this.userRepository.getUsers();
  }
}