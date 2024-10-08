import { FastifyReply, FastifyRequest } from "fastify";
import { injectable, inject } from "inversify"; // Adiciona o inject
import AppContainer from '@/common/container';
import { revenueSchema } from "@/modules/revenue/infra/http/validators/createRevenueValidators"; // Certifique-se de ajustar o caminho conforme necessário
import { ZodError } from "zod";
import { fixedExpenseSchema } from "../validators/createFixedExpenseValidator";
import { CreateFixedExpenseService } from "../../services/createFixedExpenseService";
import { UpdateFixedExpenseService } from "../../services/updateFixedExpenseService";
import { FixedExpenseDoesNotExist } from "../../errors/FixedExpenseDoesNotExist";
import { ListFixedExpenseService } from "../../services/listFixedExpenseService";

@injectable()
export class FixedExpenseController {

async create(request: FastifyRequest, reply: FastifyReply): Promise<FastifyReply> {


    const createService = AppContainer.resolve<CreateFixedExpenseService>(CreateFixedExpenseService);

        try {
            // Valida os dados do corpo da requisição usando o Zod
            const fixedExpense = fixedExpenseSchema.parse(request.body);

            // Executa o serviço de criação de despesa fixa
            const response = await createService.execute({ data: fixedExpense });

            return reply.status(201).send({ message: "Fixed Expense created successfully", data: response });
        } catch (err) {
            if (err instanceof ZodError) {
            return reply.status(400).send({ message: "Validation error", issues: err.errors });
            }
            return reply.status(500).send({ message: "An error occurred while creating Fixed Expense", error: (err as Error).message });
        }
    }

  async update(request: FastifyRequest, reply: FastifyReply) {
    const dataReq: any = request.body;
    const updateFixedExpense = AppContainer.resolve<UpdateFixedExpenseService>(UpdateFixedExpenseService);
    const { id, ...data } = dataReq;
    try {
      await updateFixedExpense.execute({ id, data });
      return reply.status(200).send({ message: "Successfully Updated Fixed Expense" });
    } catch (error) {
      console.log("Erro no controlador:", error); // Adicione este log para capturar erros
      if (error instanceof FixedExpenseDoesNotExist) {
        return reply.status(404).send({ message: error.message });
      }
      return reply.status(500).send({ message: "Internal Server Error" });
    }
  }

  
  async list(request: FastifyRequest, reply: FastifyReply): Promise<FastifyReply> {
    const listService = AppContainer.resolve<ListFixedExpenseService>(ListFixedExpenseService);

    try {
      // Executa o serviço de listagem de despesas fixas
      const users = await listService.execute();

      return reply.status(200).send({ message: "Fixed Expenses retrieved successfully", data: users });
    } catch (err) {
      return reply.status(500).send({ message: "An error occurred while retrieving Fixed Expenses", error: (err as Error).message });
    }
  }

}
