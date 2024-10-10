import { FastifyInstance } from "fastify";
import container from "@/common/container";
import Types from "@/common/container/types";
import { FinanceController } from "../controllers/FincanceController";

export async function routerFiance(app: FastifyInstance) {
  const financeController = container.get<FinanceController>(Types.FinanceController);

  app.post("/list-by-period", financeController.getExpensesByPeriod.bind(financeController));
  app.post("/list-by-date", financeController.getExpensesByDate.bind(financeController));
  app.post("/list-by-expenses", financeController.getUserExpenses.bind(financeController));
  app.post("/calculate-by-period", financeController.calculateExpenses.bind(financeController));
}
