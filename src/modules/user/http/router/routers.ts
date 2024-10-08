import { FastifyInstance } from "fastify";
import container from "@/common/container";
import Types from "@/common/container/types";
import { UserController } from "../controller/userController";

export async function routerUser(app: FastifyInstance) {
    const userController = container.get<UserController>(Types.UserController);

    app.post("/create", userController.create.bind(userController));
    app.patch("/update", userController.update.bind(userController));
    app.get("/list", userController.list.bind(userController));
}
