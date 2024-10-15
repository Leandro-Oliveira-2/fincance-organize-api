import {
  PrismaClient,
  FixedExpense,
  VariableExpense,
  User,
} from "@prisma/client";
import { injectable } from "inversify";
import { IReportRepository } from "./IReportRepository";

const prisma = new PrismaClient();

@injectable()
export class ReportRepository implements IReportRepository {
  
}
