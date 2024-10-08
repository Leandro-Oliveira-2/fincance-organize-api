import { FastifyReply, FastifyRequest } from "fastify";
import { injectable, inject } from "inversify"; // Adiciona o inject
import AppContainer from '@/common/container';
import { ZodError } from "zod";
import { CreateVariableExpenseService } from "@/modules/variableExpense/services/createVariableExpensive";
import { variableExpenseSchema } from "../validators/createVariableExpensiveValidators";
import { ListVariableExpenseService } from "@/modules/variableExpense/services/listVariableExpensive";
import { UpdateVariableExpenseService } from "@/modules/variableExpense/services/updateVariableExpensive";
import { VariableExpensiveDoesNotExist } from "@/modules/variableExpense/errors/VariableExpensiveDoesNotExist";

@injectable()
export class VariableExpenseController {


  async create(request: FastifyRequest, reply: FastifyReply) {
    const createVariableExpenseService = AppContainer.resolve<CreateVariableExpenseService>(CreateVariableExpenseService);

    try {
      // Valida os dados do usuário
      const user = variableExpenseSchema.parse(request.body);

      const response = await createVariableExpenseService.execute({ data: user });
      return reply.status(201).send({ message: "Successfully created Revenue", response });
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

  async list(request: FastifyRequest, reply: FastifyReply) {
    const listVariableExpenseService = AppContainer.resolve<ListVariableExpenseService>(ListVariableExpenseService);
    const VariablesExpese = await listVariableExpenseService.execute();
    return reply
        .status(201)
        .send({ message: "Successfully created User", VariablesExpese });
  }

  async update(request: FastifyRequest, reply: FastifyReply) {
    const dataReq: any = request.body;
    const updateVariableExpenseService = AppContainer.resolve<UpdateVariableExpenseService>(UpdateVariableExpenseService);
    const { id, ...data } = dataReq;
    try {
      await updateVariableExpenseService.execute({ id, data });
      return reply.status(200).send({ message: "Successfully Updated User" });
    } catch (error) {
      console.log("Erro no controlador:", error); // Adicione este log para capturar erros
      if (error instanceof VariableExpensiveDoesNotExist) {
        return reply.status(404).send({ message: error.message });
      }
      return reply.status(500).send({ message: "Internal Server Error" });
    }
  }
}
