import { FastifyReply, FastifyRequest } from "fastify";import { injectable } from "inversify";
import AppContainer from '@/common/container';
import { GetExpensesByPeriodService } from "../../services/GetExpensesByPeriodService";
import { GetUserExpensesByDateService } from "../../services/GetUserExpensesByDateService";
import { GetUserExpensesService } from "../../services/GetUserExpensesService";
import { CalculateTotalExpensesService } from "../../services/CalculateTotalExpensesService";

@injectable()
export class FinanceController {
    
    async getExpensesByPeriod(request: FastifyRequest<{ Body: { userId: string; startDate: string; endDate: string; } }>, reply: FastifyReply): Promise<FastifyReply> {
        const { userId, startDate, endDate } = request.body;

        const getExpensesByPeriodService = AppContainer.resolve<GetExpensesByPeriodService>(GetExpensesByPeriodService);

        try {
            const response = await getExpensesByPeriodService.execute({
                userId,
                startDate: new Date(startDate),
                endDate: new Date(endDate),
            });

            return reply.status(200).send({
                status: 'success',
                data: response,
            });
        } catch (error) {
            console.error('Error fetching expenses by period:', error);
            return reply.status(500).send({
                status: 'error',
                message: error instanceof Error ? error.message : "Unexpected error occurred",
            });
        }
    }

    async getExpensesByDate(request: FastifyRequest, reply: FastifyReply): Promise<FastifyReply> {
        const getUserExpensesByDateService = AppContainer.resolve<GetUserExpensesByDateService>(GetUserExpensesByDateService);

        try {
            const { userId, year, month, day } = request.body as {
                userId: number;
                year: number;
                month?: number;
                day?: number;
            };

            const response = await getUserExpensesByDateService.execute({
                userId,
                year,
                month,
                day
            });

            return reply.status(200).send(response);
        } catch (error) {
            return reply.status(400).send({
                message: error instanceof Error ? error.message : "Unexpected error occurred"
            });
        }
    }

    async getUserExpenses(request: FastifyRequest, reply: FastifyReply): Promise<FastifyReply> {

    
        const dataReq: any = request.body;
        const getUserExpensesService = AppContainer.resolve<GetUserExpensesService>(GetUserExpensesService);
        const { id } = dataReq;
        try {        
            const response = await getUserExpensesService.execute(id);
        
            return reply.status(200).send(response);
        } catch (error) {
            return reply.status(400).send({
                message: error instanceof Error ? error.message : "Unexpected error occurred"
            });
        }
    }

    async calculateTotalExpenses(request: FastifyRequest, reply: FastifyReply): Promise<FastifyReply> {
        const { userId, year } = request.body as { userId: number; year: number };
    
        const calculateTotalExpensesService = AppContainer.resolve<CalculateTotalExpensesService>(CalculateTotalExpensesService);

        try {        
            const response = await calculateTotalExpensesService.execute({ userId, year });
        
            return reply.status(200).send(response);
        } catch (error) {        
            return reply.status(400).send({
                message: error instanceof Error ? error.message : "Unexpected error occurred"
            });
        }
    }

}
