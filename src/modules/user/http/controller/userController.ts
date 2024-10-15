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
      // Valida os dados do usuário usando Zod
      const user = userSchema.parse(request.body);

      // Executa o serviço de criação de usuário
      const response = await createService.execute({ data: user });
      return reply.status(201).send({ message: "Successfully created User", data: response });
    } catch (err) {
      if (err instanceof ZodError) {
        return reply.status(400).send({ message: "Validation error", issues: err.errors });
      }

      // Log de erro e retorno de mensagem de erro genérico
      console.error("Error in create user:", (err as Error).message);
      return reply.status(500).send({ message: "An error occurred while creating the user" });
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
