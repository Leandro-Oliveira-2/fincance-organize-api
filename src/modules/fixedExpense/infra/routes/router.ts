import { FastifyInstance } from "fastify";
import container from "@/common/container";
import Types from "@/common/container/types";
import { FixedExpenseController } from "../controller/fixedExpenseController";

export async function routerFixedExpense(app: FastifyInstance) {
  const fixedExpenseController = container.get<FixedExpenseController>(Types.FixedExpenseController);

  app.post("/create", fixedExpenseController.create.bind(fixedExpenseController));
  app.patch("/update", fixedExpenseController.update.bind(fixedExpenseController));
  app.get("/list", fixedExpenseController.list.bind(fixedExpenseController));
}
