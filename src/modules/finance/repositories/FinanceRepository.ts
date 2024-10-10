    import {
    PrismaClient,
    FixedExpense,
    VariableExpense,
    User,
    } from "@prisma/client";
    import { injectable } from "inversify";
    import { IFinanceRepository } from "./IFinanceRepository";

    const prisma = new PrismaClient();

    @injectable()
    export class FinanceRepository implements IFinanceRepository {
   
    async calculateExpenses(
        userId: number,
        year: number,
        startMonth?: number,
        numberOfMonths?: number,
        startDate?: Date,
        endDate?: Date
      ): Promise<{ fixed: number; variable: number; total: number }> {
        let fixedExpenses, variableExpenses;
    
        if (startDate && endDate) {
          // Cálculo para um intervalo de datas customizado
          fixedExpenses = await prisma.fixedExpense.aggregate({
            where: {
              userId,
              createdAt: {
                gte: startDate,
                lte: endDate,
              },
            },
            _sum: {
              amount: true,
            },
          });
    
          variableExpenses = await prisma.variableExpense.aggregate({
            where: {
              userId,
              createdAt: {
                gte: startDate,
                lte: endDate,
              },
            },
            _sum: {
              amount: true,
            },
          });
        } else if (startMonth && numberOfMonths) {
          // Cálculo para um intervalo baseado em meses (mensal, bimestral, semestral, etc.)
          const endMonth = startMonth + numberOfMonths - 1;
    
          fixedExpenses = await prisma.fixedExpense.aggregate({
            where: {
              userId,
              year,
              month: {
                gte: startMonth,
                lte: endMonth,
              },
            },
            _sum: {
              amount: true,
            },
          });
    
          variableExpenses = await prisma.variableExpense.aggregate({
            where: {
              userId,
              year,
              month: {
                gte: startMonth,
                lte: endMonth,
              },
            },
            _sum: {
              amount: true,
            },
          });
        } else {
          // Caso esteja faltando os parâmetros necessários
          throw new Error("Either a custom period or a month range must be provided.");
        }
    
        const fixed = fixedExpenses._sum.amount || 0;
        const variable = variableExpenses._sum.amount || 0;
        const total = fixed + variable;
    
        return { fixed, variable, total };
      }



    // Método para buscar o usuário e suas despesas fixas e variáveis por ano
    async getUserExpenses(userId: number): Promise<{
        user: User;
        fixedExpenses: FixedExpense[];
        variableExpenses: VariableExpense[];
    }> {
        // Busca os dados do usuário pelo ID
        const user = await prisma.user.findUnique({
        where: { id: userId },
        });

        if (!user) {
        throw new Error("User not found");
        }

        // Busca as despesas fixas do usuário
        const fixedExpenses = await prisma.fixedExpense.findMany({
        where: { userId: userId },
        });

        // Busca as despesas variáveis do usuário
        const variableExpenses = await prisma.variableExpense.findMany({
        where: { userId: userId },
        });

        // Retorna os dados no formato solicitado
        return {
        user,
        fixedExpenses,
        variableExpenses,
        };
    }

    async getUserExpensesByDate(
        userId: number,
        year: number,
        month?: number,
        day?: number
    ): Promise<{
        user: User | null;
        fixedExpenses: FixedExpense[];
        variableExpenses: VariableExpense[];
    }> {
        const user = await prisma.user.findUnique({
        where: { id: userId },
        include: {
            fixedExpenses: {
            where: {
                year,
                ...(month !== undefined ? { month } : {}),
                ...(day !== undefined
                ? {
                    createdAt: {
                        gte: new Date(year, month! - 1, day!), // Início do dia
                        lt: new Date(year, month! - 1, day! + 1), // Final do dia
                    },
                    }
                : {}),
            },
            },
            variableExpenses: {
            where: {
                year,
                ...(month !== undefined ? { month } : {}),
                ...(day !== undefined
                ? {
                    createdAt: {
                        gte: new Date(year, month! - 1, day!), // Início do dia
                        lt: new Date(year, month! - 1, day! + 1), // Final do dia
                    },
                    }
                : {}),
            },
            },
        },
        });

        return {
        user,
        fixedExpenses: user?.fixedExpenses || [],
        variableExpenses: user?.variableExpenses || [],
        };
    }

    // Novo Método para buscar despesas fixas e variáveis dentro de um período
    async getUserExpensesByPeriod(
        userId: number,
        startDate: Date,
        endDate: Date
    ): Promise<{
        user: User | null;
        fixedExpenses: FixedExpense[];
        variableExpenses: VariableExpense[];
    }> {
        const user = await prisma.user.findUnique({
        where: { id: userId },
        include: {
            fixedExpenses: {
            where: {
                createdAt: {
                gte: startDate, // Data de início recebida da requisição
                lte: endDate, // Data de fim recebida da requisição
                },
            },
            },
            variableExpenses: {
            where: {
                createdAt: {
                gte: startDate, // Data de início recebida da requisição
                lte: endDate, // Data de fim recebida da requisição
                },
            },
            },
        },
        });

        return {
        user,
        fixedExpenses: user?.fixedExpenses || [],
        variableExpenses: user?.variableExpenses || [],
        };
    }
    }
