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

  async create(request: FastifyRequest, reply: FastifyReply) {
    const createService = AppContainer.resolve<CreateFixedExpenseService>(CreateFixedExpenseService);
    try {
      // Valida os dados do usuário
      const fixedExpense = fixedExpenseSchema.parse(request.body);

      const response = await createService.execute({ data: fixedExpense });
         return reply.status(201).send({ message: "Successfully created Fixed Expense", response });
    } catch (err) {
      if (err instanceof ZodError) {
        return reply.status(400).send({ message: "Validation error", issues: err.errors });
      }
      if (err instanceof Error) {
        return reply.status(500).send({ message: err.message });
      }
      return reply.status(400).send({ message: "Invalid request data" });
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

  
  async list(request: FastifyRequest, reply: FastifyReply) {
    const listFixedExpense = AppContainer.resolve<ListFixedExpenseService>(ListFixedExpenseService);
    const users = await listFixedExpense.execute();
    return reply
        .status(201)
        .send({ message: "Successfully created User", users });
  }

}
