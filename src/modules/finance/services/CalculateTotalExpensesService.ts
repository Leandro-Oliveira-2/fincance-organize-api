import Types from "@/common/container/types";
import { inject, injectable } from "inversify";
import { IFinanceRepository } from "../repositories/IFinanceRepository";
import { IResponse } from "../responses/CalculateTotalResponse";
import { IUserRepository } from "@/modules/user/repositories/IUserRepository";

interface IRequest {
    userId: number;
    year: number;
}



@injectable()
export class CalculateTotalExpensesService {
    @inject(Types.FinanceRepository) private financeRepository!: IFinanceRepository;
    @inject(Types.UserRepository) private userRepository!: IUserRepository;
    async execute({ userId, year }: IRequest): Promise<IResponse> {
        if (userId <= 0) {
            throw new Error('Invalid userId');
        }
        
        if (year < 1900 || year > new Date().getFullYear()) {
            throw new Error('Invalid year');
        }

        const user = await this.userRepository.findById(userId);
        if (!user){
            throw new Error('User not found');
        }
    
        const result = await this.financeRepository.calculateTotalExpenses(userId, year);
    
        return {
            fixed: result.fixed,
            variable: result.variable,
            total: result.total,
        };
    }
}
