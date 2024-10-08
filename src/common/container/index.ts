import { Container } from "inversify";
import Types from "@/common/container/types";
import { IUserRepository } from "@/modules/user/repositories/IUserRepository";
import { UserRepository } from "@/modules/user/repositories/UserRepository";
import { UserController } from "@/modules/user/http/controller/userController";
import { createUserService } from "@/modules/user/services/createUserService";
import { UpdateUserService } from "@/modules/user/services/updateUserService";
import AuthController from "@/modules/auth/infra/http/controllers/AuthController";
import { ListUserService } from "@/modules/user/services/listUserService";
import { RevenueRepository } from "@/modules/revenue/repositories/RevenueRepository";
import { RevenueController } from "@/modules/revenue/http/controller/RevenueController";
import { CreateRevenueService } from "@/modules/revenue/services/createRevenueService";
import { ListRevenueService } from "@/modules/revenue/services/ListRevenueService";

const container = new Container();

container.bind<UserController>(Types.UserController).to(UserController);
container.bind<IUserRepository>(Types.UserRepository).to(UserRepository);
container.bind<createUserService>(Types.createUserService).to(createUserService);
container.bind<UpdateUserService>(Types.UpdateUserService).to(UpdateUserService);
container.bind(Types.AuthController).toConstantValue(new AuthController());
container.bind<ListUserService>(Types.ListUserService).to(ListUserService);
container.bind<RevenueRepository>(Types.RevenueRepository).to(RevenueRepository);
container.bind<RevenueController>(Types.RevenueController).to(RevenueController);
container.bind<CreateRevenueService>(Types.CreateRevenueService).to(CreateRevenueService);
container.bind<ListRevenueService>(Types.ListRevenueService).to(ListRevenueService);
export default container;
