import PDFKit from 'pdfkit';
import fs from 'fs';
import path from 'path';
import moment from 'moment';
import Types from "@/common/container/types";
import { inject, injectable } from "inversify";
import { IFinanceRepository } from "@/modules/finance/repositories/IFinanceRepository";

@injectable()
export class RelatorioService {
    @inject(Types.FinanceRepository) private financeRepository!: IFinanceRepository;

    async generateReport(userId: number, startDate: Date, endDate: Date): Promise<string> {
        // Obter as despesas e receitas no período
        const expenses = await this.financeRepository.getUserExpensesByPeriod(userId, startDate, endDate);
        console.log('Expenses:', expenses);

        // Caminho onde o PDF será salvo no servidor
        const fileName = `relatorio_${moment().format('YYYY-MM-DD_HH-mm-ss')}.pdf`;
        const reportsDir = path.join(__dirname, '..', 'generated_reports');
        const filePath = path.join(reportsDir, fileName);

        // Verificar se o diretório "generated_reports" existe e criar se não existir
        if (!fs.existsSync(reportsDir)) {
            fs.mkdirSync(reportsDir, { recursive: true });
        }

        // Criar um novo documento PDF
        const doc = new PDFKit();
        const writeStream = fs.createWriteStream(filePath);
        doc.pipe(writeStream);

        // Adicionar uma frase simples ao PDF para teste
        doc.fontSize(25).text('Relatório de Despesas e Receitas', {
            align: 'center',
        });

        // Adicionar Receitas
        doc.moveDown().fontSize(16).text('Receitas:', { underline: true });
        if (expenses.revenues.length > 0) {
            expenses.revenues.forEach(receita => {
                doc.fontSize(12).text(`${receita.source}: R$${receita.amount.toFixed(2)}`);
            });
        } else {
            doc.fontSize(12).text('Nenhuma receita registrada.');
        }

        // Adicionar Despesas Fixas
        doc.moveDown().fontSize(16).text('Despesas Fixas:', { underline: true });
        if (expenses.fixedExpenses.length > 0) {
            expenses.fixedExpenses.forEach(despesaFixa => {
                doc.fontSize(12).text(`${despesaFixa.description}: R$${despesaFixa.amount.toFixed(2)}`);
            });
        } else {
            doc.fontSize(12).text('Nenhuma despesa fixa registrada.');
        }

        // Adicionar Despesas Variáveis
        doc.moveDown().fontSize(16).text('Despesas Variáveis:', { underline: true });
        if (expenses.variableExpenses.length > 0) {
            expenses.variableExpenses.forEach(despesaVariavel => {
                doc.fontSize(12).text(`${despesaVariavel.description}: R$${despesaVariavel.amount.toFixed(2)}`);
            });
        } else {
            doc.fontSize(12).text('Nenhuma despesa variável registrada.');
        }

        // Finalizar o documento PDF
        doc.end();

        // Aguardar a conclusão do stream de escrita antes de fechar
        return new Promise<string>((resolve, reject) => {
            writeStream.on('finish', () => {
                resolve(filePath); // Quando o stream terminar, retorne o caminho do arquivo
            });

            writeStream.on('error', (error) => {
                reject(error); // Se houver um erro, rejeite a promessa
            });
        });
    }
}
