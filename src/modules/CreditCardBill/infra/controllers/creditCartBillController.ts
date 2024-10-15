import { FastifyRequest, FastifyReply } from "fastify";
import { injectable } from "inversify";
import AppContainer from '@/common/container';
import { ZodError } from "zod";
import { NotFoundError } from "@/common/errors/NotFoundError";
import { ValidationError } from "@/common/errors/ValidationError";
import { CreateCreditCardBillService } from "../../services/CreateCreditCardBillService";
import { createCreditCardBillSchema } from "../validators/createCreditCardBillValidator";
import { ListCreditCardBillsService } from "../../services/ListCreditCardBillsService";
import { UpdateCreditCardBillService } from "../../services/UpdateCreditCardBillService";
import { updateCreditCardBillSchema } from "../validators/updateCreditCardBillSchema";

@injectable()
export class CreditCardBillController {

  // Método para criar uma fatura de cartão de crédito
  async create(request: FastifyRequest, reply: FastifyReply) {
    const createCreditCardBillService = AppContainer.resolve<CreateCreditCardBillService>(CreateCreditCardBillService);

    try {
      // Valida os dados da fatura com o Zod
      const billData = createCreditCardBillSchema.parse(request.body);

      // Chama o serviço de criação da fatura
      const newBill = await createCreditCardBillService.execute({ data: billData });

      return reply.status(201).send({ message: "Credit card bill created successfully", data: newBill });
    } catch (err) {
      if (err instanceof ZodError) {
        return reply.status(400).send({ message: "Validation error", issues: err.errors });
      }

      console.error("Error in creating credit card bill:", err);
      return reply.status(500).send({ message: "An error occurred while creating the credit card bill" });
    }
  }

  // Método para listar as faturas de cartão de crédito
  async list(request: FastifyRequest, reply: FastifyReply) {
    const listCreditCardBillsService = AppContainer.resolve<ListCreditCardBillsService>(ListCreditCardBillsService);
    const data:any = request.body;
    try {
      // Obtém o userId do request, se houver
      const userId = data.userId;
      // Chama o serviço para listar as faturas de acordo com o userId (ou todas se não houver)
      const bills = await listCreditCardBillsService.execute({ userId });

      return reply.status(200).send({ message: "Credit card bills retrieved successfully", data: bills });
    } catch (err) {
      console.error("Error in listing credit card bills:", err);
      return reply.status(500).send({ message: "An error occurred while retrieving the credit card bills" });
    }
  }

  // Método para atualizar uma fatura de cartão de crédito
  async update(request: FastifyRequest, reply: FastifyReply) {
    const updateCreditCardBillService = AppContainer.resolve<UpdateCreditCardBillService>(UpdateCreditCardBillService);

    // Extrair o ID e os dados da fatura a serem atualizados
    const { id, ...dataReq } = request.body as any;

    try {
      // Valida os dados de atualização com Zod
      const parsedData = updateCreditCardBillSchema.safeParse(dataReq);
      if (!parsedData.success) {
        return reply.status(400).send({ message: "Validation error", issues: parsedData.error.errors });
      }

      // Chama o serviço de atualização da fatura
      const updatedBill = await updateCreditCardBillService.execute({ id, data: parsedData.data });

      return reply.status(200).send({ message: "Credit card bill updated successfully", data: updatedBill });
    } catch (err) {
      if (err instanceof NotFoundError) {
        return reply.status(404).send({ message: err.message });
      } else if (err instanceof ValidationError) {
        return reply.status(400).send({ message: err.message, issues: err.errors });
      }

      console.error("Error in updating credit card bill:", err);
      return reply.status(500).send({ message: "An error occurred while updating the credit card bill" });
    }
  }
}
