import { ListRevenueService } from "@/modules/revenue/services/ListRevenueService";

const Types = {
  UserService: Symbol("UserService"),
  UserController: Symbol("UserController"),
  UserRepository: Symbol("UserRepository"),
  createUserService: Symbol("createUserService"),
  UpdateUserService: Symbol("UpdateUserService"),
  AuthController: Symbol("AuthController"),
  ListUserService: Symbol("ListUserService"),
  RevenueRepository: Symbol("RevenueRepository"),
  RevenueController: Symbol("RevenueController"),
  CreateRevenueService: Symbol("CreateRevenueService"),
  ListRevenueService: Symbol("ListRevenueService"),
};

export default Types;
