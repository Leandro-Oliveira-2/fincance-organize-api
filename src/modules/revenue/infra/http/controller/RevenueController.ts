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

@injectable()
export class RevenueController {
  constructor(
    @inject(Types.CreateRevenueService)
    private createRevenueService: CreateRevenueService,
    @inject(Types.ListRevenueService) private listRevenueService: ListRevenueService
  ) {}

  async create(request: FastifyRequest, reply: FastifyReply) {
    try {
      // Valida os dados do usuário
      const user = revenueSchema.parse(request.body);

      const response = await this.createRevenueService.execute({ data: user });
      return reply
        .status(201)
        .send({ message: "Successfully created Revenue", response });
    } catch (err) {
      if (err instanceof ZodError) {
        return reply
          .status(400)
          .send({ message: "Validation error", issues: err.errors });
      }
      if (err instanceof Error) {
        return reply.status(500).send({ message: err.message });
      }
      return reply.status(400).send({ message: "Invalid request data" });
    }
  }

  async list(request: FastifyRequest, reply: FastifyReply) {
    const users = await this.listRevenueService.execute();
    return reply
        .status(201)
        .send({ message: "Successfully created User", users });
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
