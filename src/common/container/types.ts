import { VariableExpenseRepository } from "@/modules/variableExpense/repositorie/variableExpenseRepository";


const Types = {
  UserService: Symbol("UserService"),
  UserController: Symbol("UserController"),
  UserRepository: Symbol("UserRepository"),
  CreateUserService: Symbol("CreateUserService"),
  UpdateUserService: Symbol("UpdateUserService"),
  AuthController: Symbol("AuthController"),
  ListUserService: Symbol("ListUserService"),
  RevenueRepository: Symbol("RevenueRepository"),
  RevenueController: Symbol("RevenueController"),
  CreateRevenueService: Symbol("CreateRevenueService"),
  ListRevenueService: Symbol("ListRevenueService"),
  FixedExpenseRepository: Symbol("FixedExpenseRepository"),
  FixedExpenseController: Symbol("FixedExpenseController"),
  VariableExpenseRepository: Symbol("VariableExpenseRepository"),
  VariableExpenseController: Symbol("VariableExpenseController"),
  FinanceRepository: Symbol("FinanceRepository"),
  FinanceController: Symbol("FinanceController"),
};

export default Types;
