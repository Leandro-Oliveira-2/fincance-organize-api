import { inject, injectable } from "inversify";
import jwt from "jsonwebtoken";
import * as argon2 from "argon2";
import * as Z from "zod";

import SecurityConfig from "@/config/SecurityConfig";
import AppError from "@/common/errors/AppError";
import Types from "@/common/container/types";

import LoginValidator from "@/modules/auth/infra/http/validators/UserLoginValidator";
import IUserLoginResponse from "@/modules/auth/responses/IUserLoginResponse";
import { IUserRepository } from "@/modules/user/repositories/IUserRepository";
import { IRevenueRepository } from "@/modules/revenue/repositories/IRevenueRepository";

interface IRequest {
  data: Z.infer<typeof LoginValidator>;
}

@injectable()
class LoginService {
  @inject(Types.UserRepository) private userRepository!: IUserRepository;
  @inject(Types.RevenueRepository) private revenueRepository!: IRevenueRepository;

  public async execute({ data }: IRequest): Promise<IUserLoginResponse> {
    const user = await this.userRepository.findByEmail(data.email.toLowerCase());
  
    if (!user) {
      throw new AppError("User not found", 404);
    }
  
    if (user.password && !(await argon2.verify(user.password, data.password))) {
      throw new AppError("Password incorrect", 401);
    }
  
    const accessToken = jwt.sign({ userId: user.id }, SecurityConfig.jwt.key, {
      expiresIn: SecurityConfig.jwt.exp,
    });
  
    const refreshToken = jwt.sign(
      { userId: user.id },
      SecurityConfig.jwt.keyRefresh,
      {
        expiresIn: SecurityConfig.jwt.refreshExp,
      }
    );
  
    // Ajustar para garantir que os resultados sejam sempre arrays
    const revenues = await this.revenueRepository.findAllByUserId(user.id);
  
    return {
      accessToken,
      accessTokenExpireIn: SecurityConfig.jwt.exp,
      refreshToken,
      refreshTokenExpireIn: SecurityConfig.jwt.refreshExp,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        birthDate: user.birthDate,
        profession: user.profession,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
        revenues: Array.isArray(revenues) ? revenues : revenues ? [revenues] : [], 
      },
    };
  }
  
  
}

export default LoginService;