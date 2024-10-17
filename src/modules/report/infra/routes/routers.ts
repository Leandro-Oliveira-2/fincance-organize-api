import { FastifyInstance } from "fastify";
import container from "@/common/container";
import Types from "@/common/container/types";
import {ReportController } from "@/modules/report/infra/controllers/ReportController";

export async function routerReport(app: FastifyInstance) {
  const reportController = container.get<ReportController>(Types.ReportController);

  app.post("/report-generate", reportController.gerarRelatorio.bind(reportController));
}
