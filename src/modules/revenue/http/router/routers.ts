import { FastifyInstance } from "fastify";
import container from "@/common/container";
import Types from "@/common/container/types";
import { RevenueController } from "../controller/RevenueController";

export async function routerRevenue(app: FastifyInstance) {
  const revenueController = container.get<RevenueController>(Types.RevenueController);

  app.post("/create", revenueController.create.bind(revenueController));
  app.get("/list", revenueController.list.bind(revenueController));
  app.patch("/update", revenueController.update.bind(revenueController));
}
