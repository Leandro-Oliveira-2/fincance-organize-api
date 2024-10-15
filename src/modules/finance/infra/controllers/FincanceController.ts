import { FastifyReply, FastifyRequest } from "fastify";import { injectable } from "inversify";
import AppContainer from '@/common/container';
import { GetExpensesByPeriodService } from "../../services/GetExpensesByPeriodService";
import { GetUserExpensesByDateService } from "../../services/GetUserExpensesByDateService";
import { GetUserExpensesService } from "../../services/GetUserExpensesService";
import { CalculateExpensesService } from "../../services/CalculateExpensesService";
import { ExpenseProjectionsService } from "../../services/ExpenseProjectionsService";

@injectable()
export class FinanceController {
    
    async calculateExpenses(request: FastifyRequest<{ Body: { userId: number, year: number, startMonth?: number, numberOfMonths?: number, startDate?: string, endDate?: string } }>, reply: FastifyReply): Promise<FastifyReply> {
        const { userId, year, startMonth, numberOfMonths, startDate, endDate } = request.body;

        const calculateExpensesService = AppContainer.resolve<CalculateExpensesService>(CalculateExpensesService);

        try {
            const response = await calculateExpensesService.execute({
                userId,
                year,
                startMonth,
                numberOfMonths,
                startDate: startDate ? new Date(startDate) : undefined,
                endDate: endDate ? new Date(endDate) : undefined
            });

            return reply.status(200).send({
                status: 'success',
                data: response,
            });
        } catch (error) {
            console.error('Error calculating expenses:', error);
            return reply.status(500).send({
                status: 'error',
                message: error instanceof Error ? error.message : "Unexpected error occurred",
            });
        }
    }

    async projectExpenses(request: FastifyRequest, reply: FastifyReply): Promise<Response> {
        const data:any = request.body;
        const {userId, year} = data;
        const expenseProjectionsService = AppContainer.resolve<ExpenseProjectionsService>(ExpenseProjectionsService);
        try {
          const projections = await expenseProjectionsService.execute({ userId, year });
          return reply.status(200).send({
            status: 'success',
            data: projections,
        });
        } catch (error) {
            console.error('Error projection expenses:', error);
            return reply.status(500).send({
                status: 'error',
                message: error instanceof Error ? error.message : "Unexpected error occurred",
            });
        }
      }


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

   

}
