import { FastifyReply, FastifyRequest } from "fastify";
import { injectable } from "inversify";
import AppContainer from '@/common/container';
import { ZodError } from "zod";
import { CreateVariableExpenseService } from "@/modules/variableExpense/services/createVariableExpensive";
import { variableExpenseSchema } from "../validators/createVariableExpensiveValidators";
import { ListVariableExpenseService } from "@/modules/variableExpense/services/listVariableExpensive";
import { UpdateVariableExpenseService } from "@/modules/variableExpense/services/updateVariableExpensive";
import { NotFoundError } from "@/common/errors/NotFoundError"; 
import { VariableExpensiveDoesNotExist } from "@/modules/variableExpense/errors/VariableExpensiveDoesNotExist";

@injectable()
export class VariableExpenseController {

  async create(request: FastifyRequest, reply: FastifyReply) {
    const createVariableExpenseService = AppContainer.resolve<CreateVariableExpenseService>(CreateVariableExpenseService);

    try {
      const variableExpense = variableExpenseSchema.parse(request.body);

      const response = await createVariableExpenseService.execute({ data: variableExpense });
      return reply.status(201).send(response);
    } catch (err) {
      if (err instanceof ZodError) {
        return reply.status(400).send({ message: "Validation error", issues: err.errors });
      }
      if (err instanceof NotFoundError) {
        return reply.status(404).send({ message: err.message });
      }
      return reply.status(500).send({ message: "An error occurred while creating variable expense" });
    }
  }

  async list(request: FastifyRequest, reply: FastifyReply) {
    const listVariableExpenseService = AppContainer.resolve<ListVariableExpenseService>(ListVariableExpenseService);
    try {
      const variableExpenses = await listVariableExpenseService.execute();
      return reply.status(200).send({ message: "Variable expenses retrieved successfully", data: variableExpenses });
    } catch (err) {
      return reply.status(500).send({ message: "An error occurred while retrieving variable expenses" });
    }
  }

  async update(request: FastifyRequest, reply: FastifyReply) {
    const dataReq: any = request.body;
    const updateVariableExpenseService = AppContainer.resolve<UpdateVariableExpenseService>(UpdateVariableExpenseService);
    
    // Separar o ID dos dados a serem atualizados
    const { id, ...data } = dataReq; 
    
    try {
      // Executa o serviço de atualização
      await updateVariableExpenseService.execute({ id, data });
      return reply.status(200).send({ message: "Successfully Updated Variable Expense" });
    } catch (error) {
      console.log("Erro no controlador:", error); 
      if (error instanceof VariableExpensiveDoesNotExist) {
        return reply.status(404).send({ message: error.message });
      }
      return reply.status(500).send({ message: "Internal Server Error" });
    }
  }
  
}
