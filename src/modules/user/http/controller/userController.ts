import { FastifyReply, FastifyRequest } from "fastify";
import { injectable, inject } from "inversify"; // Adiciona o inject
import { createUserService } from "../../services/createUserService";
import Types from "@/common/container/types"; // Certifique-se de ajustar o caminho conforme necessário
import { userSchema } from "@/modules/user/http/validators/createUserValidators";
import { ZodError } from "zod";
import { UpdateUserService } from "../../services/updateUserService";
import { UserDoesNotExist } from "../../errors/UserDoesNotExist";
import { ListUserService } from "../../services/listUserService";

@injectable()
export class UserController {
  constructor( 
    @inject(Types.createUserService) private createUserService: createUserService, // Injeção de dependência correta
    @inject(Types.UpdateUserService) private updateUserService: UpdateUserService, // Injeção de dependência correta
    @inject(Types.ListUserService) private listUserService: ListUserService // Injeção de dependência correta
  ) {}

  async create(request: FastifyRequest, reply: FastifyReply) {
    try {
      // Valida os dados do usuário
      const user = userSchema.parse(request.body);

      const response = await this.createUserService.execute({ data: user });
      return reply
        .status(201)
        .send({ message: "Successfully created User", response });
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

  async update(request: FastifyRequest, reply: FastifyReply) {
    const dataReq: any = request.body;
    const { id, ...data } = dataReq;
    try {
      console.log("Data:", data);
      console.log("ID:", id);
      console.log("DataReq:", dataReq);
      await this.updateUserService.execute({ id, data });
      return reply.status(200).send({ message: "Successfully Updated User" });
    } catch (error) {
      console.log("Erro no controlador:", error); // Adicione este log para capturar erros
      if (error instanceof UserDoesNotExist) {
        return reply.status(404).send({ message: error.message });
      }
      return reply.status(500).send({ message: "Internal Server Error" });
    }
  }

  async list(request: FastifyRequest, reply: FastifyReply) {
    const users = await this.listUserService.execute();
    return reply
        .status(201)
        .send({ message: "Successfully created User", users });
  }

}
