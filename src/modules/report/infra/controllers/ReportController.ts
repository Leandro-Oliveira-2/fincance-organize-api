import { FastifyReply, FastifyRequest } from "fastify";
import { injectable } from "inversify";
import fs from 'fs';
import path from 'path';
import AppContainer from "@/common/container";
import { RelatorioService } from "../../services/createReportService";

@injectable()
export class ReportController {
  async gerarRelatorio(
    req: FastifyRequest,
    reply: FastifyReply
  ): Promise<FastifyReply> {
    const relatorioService = AppContainer.resolve<RelatorioService>(RelatorioService);

    try {
      const { userId, startDate, endDate }: any = req.body;

      // 1. Gerar o relatório PDF e salvar o arquivo no servidor
      const filePath = await relatorioService.generateReport(
        userId,
        new Date(startDate),
        new Date(endDate)
      );

      // Verificar se o arquivo foi gerado corretamente
      if (!fs.existsSync(filePath)) {
        return reply.status(404).send({ error: 'Relatório não encontrado.' });
      }

      // 2. Ler o arquivo PDF gerado para enviar como resposta
      const fileStat = fs.statSync(filePath);
      const fileStream = fs.createReadStream(filePath);

      // Configurar os cabeçalhos de resposta para que o cliente saiba que é um PDF
      reply.header("Content-Type", "application/pdf");
      reply.header("Content-Length", fileStat.size);
      reply.header(
        "Content-Disposition",
        `attachment; filename=relatorio_${new Date().toISOString()}.pdf`
      );

      // 3. Enviar o arquivo PDF como um stream de resposta
      return reply.send(fileStream); // enviar o stream do arquivo PDF
    } catch (error) {
      console.error("Erro ao gerar o relatório:", error);
      return reply.status(500).send({ error: "Erro ao gerar o relatório" });
    }
  }
}
