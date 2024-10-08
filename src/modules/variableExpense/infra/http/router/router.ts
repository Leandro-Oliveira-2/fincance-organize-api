import { FastifyInstance } from "fastify";
import container from "@/common/container";
import Types from "@/common/container/types";
import { VariableExpenseController } from "../controller/variableExpenseController";

export async function routerVariableExpense(app: FastifyInstance) {
  const variableExpense = container.get<VariableExpenseController>(Types.VariableExpenseController);

  app.post("/create", variableExpense.create.bind(variableExpense));
  app.get("/list", variableExpense.list.bind(variableExpense));
  app.patch("/update", variableExpense.update.bind(variableExpense));
}
