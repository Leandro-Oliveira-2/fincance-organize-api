import { FastifyReply, FastifyRequest } from "fastify";
import { injectable, inject } from "inversify"; // Adiciona o inject
import { CreateUserService } from "../../services/createUserService";
import Types from "@/common/container/types"; // Certifique-se de ajustar o caminho conforme necessário
import { userSchema } from "@/modules/user/http/validators/createUserValidators";
import { ZodError } from "zod";
import { UpdateUserService } from "../../services/updateUserService";
import { UserDoesNotExist } from "../../errors/UserDoesNotExist";
import { ListUserService } from "../../services/listUserService";
import AppContainer from "@/common/container";

@injectable()
export class UserController {

  async create(request: FastifyRequest, reply: FastifyReply): Promise<FastifyReply> {
    const createService = AppContainer.resolve<CreateUserService>(CreateUserService);

    try {
      const user = userSchema.parse(request.body);

      const response = await createService.execute({ data: user });
      return reply.status(201).send({ message: "Successfully created User", data: response });
    } catch (err: any) {
      if (err instanceof ZodError) {
        return reply.status(400).send({ message: "Validation error", issues: err.errors });
      }

      // Log completo do erro com mais detalhes
      console.error("Erro no controlador ao criar usuário:", JSON.stringify(err, null, 2));

      // Verifica se o erro é de e-mail duplicado ou outro erro específico do Prisma
      if (err.code === "P2002" && err.meta?.target?.includes("email")) {
        return reply.status(409).send({ message: "Email já está em uso." });
      }

      // Retorna os detalhes do erro no caso de outro erro genérico
      return reply.status(500).send({
        message: "An error occurred while creating the user",
        details: err.message || "Detalhes não disponíveis",  // Mostra mais detalhes sobre o erro
      });
    }
  }

  async update(request: FastifyRequest, reply: FastifyReply) {
    const updateUserService = AppContainer.resolve<UpdateUserService>(UpdateUserService);
    const dataReq: any = request.body;
    const { id, ...data } = dataReq;
    try {
      await updateUserService.execute({ id, data });
      return reply.status(200).send({ message: "Successfully Updated User" });
    } catch (error) {
      console.log("Erro no controlador:", error); // Adicione este log para capturar erros
      if (error instanceof UserDoesNotExist) {
        return reply.status(404).send({ message: error.message });
      }
      return reply.status(500).send({ message: "Internal Server Error" });
    }
  }

  async list(request: FastifyRequest, reply: FastifyReply): Promise<FastifyReply> {
    const listService = AppContainer.resolve<ListUserService>(ListUserService);
    try {
      // Executa o serviço de listagem de usuários
      const users = await listService.execute();
      return reply.status(200).send({ message: "Successfully retrieved Users", data: users });
    } catch (error) {
      console.error("Error retrieving users:", (error as Error).message);
      return reply.status(500).send({ message: "An error occurred while retrieving users" });
    }
  }

}
