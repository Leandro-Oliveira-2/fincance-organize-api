import { inject, injectable } from "inversify";
import jwt from "jsonwebtoken";
import * as argon2 from "argon2";
import * as Z from "zod";

import SecurityConfig from "@/config/SecurityConfig";
import AppError from "@/common/errors/AppError";
import Types from "@/common/container/types";

import LoginValidator from "@/modules/auth/infra/http/validators/UserLoginValidator";
import IResponse from "@/modules/auth/responses/IUserLoginResponse";
import { IUserRepository } from "@/modules/user/repositories/IUserRepository";

interface IRequest {
  data: Z.infer<typeof LoginValidator>;
}

@injectable()
class LoginService {
  @inject(Types.UserRepository) private userRepository!: IUserRepository;

  public async execute({ data }: IRequest): Promise<IResponse> {
    // Busca o usuário pelo email usando o repositório Prisma
    const user = await this.userRepository.findByEmail(data.email.toLowerCase());

    // Verifica se o usuário foi encontrado
    if (!user) {
      throw new AppError("User not found", 404);
    }

    // Verifica a senha usando argon2
    if (user.password && !(await argon2.verify(user.password, data.password))) {
      throw new AppError("Password incorrect", 401);
    }

    // Gera o token de acesso
    const accessToken = jwt.sign({ userId: user.id }, SecurityConfig.jwt.key, {
      expiresIn: SecurityConfig.jwt.exp,
    });

    // Gera o token de refresh
    const refreshToken = jwt.sign(
      { userId: user.id },
      SecurityConfig.jwt.keyRefresh,
      {
        expiresIn: SecurityConfig.jwt.refreshExp,
      }
    );

    // Retorna os dados e os tokens
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
        salary: user.salary,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
    };
  }
}

export default LoginService;