import { FixedExpense, Revenue, VariableExpense } from "@prisma/client";


interface IUserLoginResponse {
  accessToken: string;
  accessTokenExpireIn: string;
  refreshToken: string;
  refreshTokenExpireIn: string;
  user: {
    id: number;
    name: string;
    email: string;
    birthDate: Date | null;
    profession: string | null;
    salary: number | null;
    createdAt: Date;
    updatedAt: Date;
    revenues: Revenue[];
  };
}

export default IUserLoginResponse;