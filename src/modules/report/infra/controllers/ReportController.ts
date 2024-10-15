import { FastifyReply, FastifyRequest } from "fastify";
import { injectable, inject } from "inversify"; // Adiciona o inject
import Types from "@/common/container/types"; // Certifique-se de ajustar o caminho conforme necessário
import { userSchema } from "@/modules/user/http/validators/createUserValidators";
import { ZodError } from "zod";
import AppContainer from "@/common/container";
import { RelatorioService } from "../../services/createReportService";

@injectable()
export class ReportController {
  async gerarRelatorio(
    req: FastifyRequest,
    reply: FastifyReply
  ): Promise<FastifyReply> {
    const relatorioService =
      AppContainer.resolve<RelatorioService>(RelatorioService);
    try {
      const { userId, startDate, endDate }: any = req.body;

      // Gerar o relatório PDF
      const pdfBytes = await relatorioService.generateReport(
        userId,
        new Date(startDate),
        new Date(endDate)
      );

      // Configurar os cabeçalhos de resposta
      reply.header("Content-Type", "application/pdf");
      reply.header(
        "Content-Disposition",
        `attachment; filename=relatorio_${new Date().toISOString()}.pdf`
      );

      // Enviar o buffer PDF para o cliente
      return reply.send(Buffer.from(pdfBytes)); // Certifique-se de converter para Buffer
    } catch (error) {
      console.error("Erro ao gerar o relatório:", error);
      return reply.status(500).send({ error: "Erro ao gerar o relatório" });
    }
  }
}
