import { FastifyReply, FastifyRequest } from "fastify";
import { injectable } from "inversify"; // Importando apenas o que é necessário
import AppContainer from '@/common/container';
import { GetExpensesByPeriodService } from "../../services/GetExpensesByPeriodService";

@injectable()
export class FinanceController {
    // Método para obter as despesas do usuário dentro de um período
    async getExpensesByPeriod(request: FastifyRequest, reply: FastifyReply): Promise<FastifyReply> {
        const { userId, startDate, endDate } = request.body as {
            userId: string;
            startDate: string;
            endDate: string;
        };

        // Resolvendo o service GetExpensesByPeriodService
        const getExpensesByPeriodService = AppContainer.resolve<GetExpensesByPeriodService>(GetExpensesByPeriodService);

        try {
            // Executa o serviço para obter as despesas no período
            const response = await getExpensesByPeriodService.execute({
                userId,
                startDate: new Date(startDate),  // Converte string para Date
                endDate: new Date(endDate)       // Converte string para Date
            });

            // Retorna o sucesso com os dados
            return reply.status(200).send(response);
        } catch (error) {
            // Tratamento de erro, caso algo dê errado
            return reply.status(400).send({
                message: error instanceof Error ? error.message : "Unexpected error occurred"
            });
        }
    }
}
