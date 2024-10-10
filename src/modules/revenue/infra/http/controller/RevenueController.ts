import { FastifyReply, FastifyRequest } from "fastify";
import { injectable, inject } from "inversify"; // Adiciona o inject
import Types from "@/common/container/types"; // Certifique-se de ajustar o caminho conforme necessário
import { revenueSchema } from "@/modules/revenue/infra/http/validators/createRevenueValidators"; // Certifique-se de ajustar o caminho conforme necessário
import { ZodError } from "zod";
import { CreateRevenueService } from "@/modules/revenue/services/createRevenueService"; // Certifique-se de ajustar o caminho conforme necessário
import { ListRevenueService } from "@/modules/revenue/services/ListRevenueService"; // Certifique-se de ajustar o caminho conforme necessário
import { UpdateRevenueService } from "@/modules/revenue/services/UpdateRevenueService"; // Certifique-se de ajustar o caminho conforme necessário
import AppContainer from '@/common/container';
import { RevenueDoesNotExist } from "@/modules/revenue/errors/RevenueDoesNotExist"; // Certifique-se de ajustar o caminho conforme necessário
import { GetAllByUserIdService } from "@/modules/revenue/services/GetAllByUserIdService";
import { CalculateRevenueByIdService } from "@/modules/revenue/services/CalculateRevenueByIdService";

@injectable()
export class RevenueController {

  async create(request: FastifyRequest, reply: FastifyReply): Promise<FastifyReply> {
    const createRevenueService = AppContainer.resolve<CreateRevenueService>(CreateRevenueService);

    try {
      // Valida os dados da receita com Zod
      const revenueData = revenueSchema.parse(request.body);

      // Chama o serviço de criação de receita
      const response = await createRevenueService.execute({ data: revenueData });

      return reply.status(201).send({ message: "Successfully created Revenue", data: response });
    } catch (err) {
      if (err instanceof ZodError) {
        return reply.status(400).send({ message: "Validation error", issues: err.errors });
      }

      // Log de erro e retorno de mensagem de erro genérico
      console.error("Error in create revenue:", (err as Error).message);
      return reply.status(500).send({ message: "An error occurred while creating revenue" });
    }
  }

  async list(request: FastifyRequest, reply: FastifyReply): Promise<FastifyReply> {
    const listRevenueService = AppContainer.resolve<ListRevenueService>(ListRevenueService);
    try {
      const revenues = await listRevenueService.execute();

      return reply.status(200).send({ message: "Successfully retrieved Revenues", data: revenues });
    } catch (err) {
      // Log de erro e retorno de mensagem de erro genérico
      console.error("Error in list revenues:", (err as Error).message);
      return reply.status(500).send({ message: "An error occurred while retrieving revenues" });
    }
  }

  async listByUserId(request: FastifyRequest, reply: FastifyReply): Promise<FastifyReply> {

    const user:any = request.body;
    const { userId } = user;  
    const listRevenueService = AppContainer.resolve<GetAllByUserIdService>(GetAllByUserIdService);
    try {
      const revenues = await listRevenueService.execute({userId});

      return reply.status(200).send({ message: "Successfully retrieved Revenues", data: revenues });
    } catch (err) {
      console.error("Error in list revenues:", (err as Error).message);
      return reply.status(500).send({ message: "An error occurred while retrieving revenues" });
    }
  }

  async calculateByUserId(request: FastifyRequest, reply: FastifyReply): Promise<FastifyReply> {

    const user:any = request.body;
    const { userId } = user;  
    const calculateRevenueService = AppContainer.resolve<CalculateRevenueByIdService>(CalculateRevenueByIdService);
    try {
      const revenues = await calculateRevenueService.execute({userId});

      return reply.status(200).send({ message: "Successfully retrieved Revenues", data: revenues });
    } catch (err) {
      console.error("Error in list revenues:", (err as Error).message);
      return reply.status(500).send({ message: "An error occurred while retrieving revenues" });
    }
  }



  async update(request: FastifyRequest, reply: FastifyReply) {
    const dataReq: any = request.body;
    const updateRevenueService = AppContainer.resolve<UpdateRevenueService>(UpdateRevenueService);
    const { id, ...data } = dataReq;
    try {
      await updateRevenueService.execute({ id, data });
      return reply.status(200).send({ message: "Successfully Updated User" });
    } catch (error) {
      console.log("Erro no controlador:", error); // Adicione este log para capturar erros
      if (error instanceof RevenueDoesNotExist) {
        return reply.status(404).send({ message: error.message });
      }
      return reply.status(500).send({ message: "Internal Server Error" });
    }
  }


}
