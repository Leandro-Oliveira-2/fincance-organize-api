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

  
  /* Calcular o saldo anterior */
  async calculatePreviousBalance(
    userId: number,
    month: number,
    year: number
  ): Promise<number> {
    const previousMonth = month === 1 ? 12 : month - 1;
    const previousYear = month === 1 ? year - 1 : year;

    const fixedExpenses = await prisma.fixedExpense.aggregate({
      where: {
        userId,
        year: previousYear,
        month: previousMonth,
        isPaid: true,
      },
      _sum: { amount: true },
    });

    const variableExpenses = await prisma.variableExpense.aggregate({
      where: {
        userId,
        year: previousYear,
        month: previousMonth,
        isPaid: true,
      },
      _sum: { amount: true },
    });

    const revenues = await prisma.revenue.aggregate({
      where: {
        userId,
        endDate: null, // Ou qualquer outro critério para receitas realizadas
      },
      _sum: { amount: true },
    });

    const previousBalance =
      (revenues._sum.amount || 0) -
      (fixedExpenses._sum.amount || 0) -
      (variableExpenses._sum.amount || 0);
    return previousBalance;
  }

  /* Calcular o saldo previsto (saldo atual + o que falta receber - o que falta pagar) */
  async calculateProjectedBalance(
    userId: number,
    month: number,
    year: number
  ): Promise<number> {
    const currentBalance = await this.calculateCurrentBalance(
      userId,
      month,
      year
    );

    const unpaidFixedExpenses = await prisma.fixedExpense.aggregate({
      where: {
        userId,
        year,
        month,
        isPaid: false,
      },
      _sum: { amount: true },
    });

    const unpaidVariableExpenses = await prisma.variableExpense.aggregate({
      where: {
        userId,
        year,
        month,
        isPaid: false,
      },
      _sum: { amount: true },
    });

    const unreceivedRevenues = await prisma.revenue.aggregate({
      where: {
        userId,
        endDate: null, // Ou outro critério para receitas previstas mas não recebidas
      },
      _sum: { amount: true },
    });

    const totalExpensesToPay =
      (unpaidFixedExpenses._sum.amount || 0) +
      (unpaidVariableExpenses._sum.amount || 0);
    const totalRevenuesToReceive = unreceivedRevenues._sum.amount || 0;

    const projectedBalance =
      currentBalance + totalRevenuesToReceive - totalExpensesToPay;
    return projectedBalance;
  }

  /*Calcular o saldo atual (recebido - gasto) (método novo)*/
  async calculateCurrentBalance(
    userId: number,
    month: number,
    year: number
  ): Promise<number> {
    const fixedExpenses = await prisma.fixedExpense.aggregate({
      where: {
        userId,
        year,
        month,
        isPaid: true,
      },
      _sum: { amount: true },
    });

    const variableExpenses = await prisma.variableExpense.aggregate({
      where: {
        userId,
        year,
        month,
        isPaid: true,
      },
      _sum: { amount: true },
    });

    const revenues = await prisma.revenue.aggregate({
      where: {
        userId,
        endDate: null, // Ou outro critério para receitas realizadas
      },
      _sum: { amount: true },
    });

    const currentBalance =
      (revenues._sum.amount || 0) -
      (fixedExpenses._sum.amount || 0) -
      (variableExpenses._sum.amount || 0);
    return currentBalance;
  }

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
      throw new Error(
        "Either a custom period or a month range must be provided."
      );
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
      where: { userId },
      take: 50, // Limitar a 50 registros por exemplo
      skip: 0, // Implementar lógica de paginação se necessário
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

  async projectExpensesForYear(
    userId: number,
    monthsToProject: number // Projeção apenas para meses futuros
  ): Promise<{ projectedFixed: number[], projectedVariable: number[], projectedTotal: number[] }> {
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth() + 1; // Mês atual (de 1 a 12)
    const currentYear = currentDate.getFullYear();   // Ano atual
  
    let totalFixed = 0;
    let totalVariable = 0;
  
    // Step 1: Buscar as despesas de Janeiro até o mês atual (passado)
    for (let i = 1; i <= currentMonth; i++) {
      const fixedExpenses = await prisma.fixedExpense.aggregate({
        where: {
          userId,
          year: currentYear,
          month: i, // Mês de janeiro até o mês atual
        },
        _sum: { amount: true },
      });
  
      const variableExpenses = await prisma.variableExpense.aggregate({
        where: {
          userId,
          year: currentYear,
          month: i, // Mês de janeiro até o mês atual
        },
        _sum: { amount: true },
      });
  
      // Acumula os valores para calcular a média
      totalFixed += fixedExpenses._sum.amount || 0;
      totalVariable += variableExpenses._sum.amount || 0;
    }
  
    // Step 2: Calcular a média das despesas até o mês atual
    const avgFixed = totalFixed / currentMonth;
    const avgVariable = totalVariable / currentMonth;
    const avgTotal = avgFixed + avgVariable;
  
    // Step 3: Projeção dos próximos meses (do mês atual até o final do ano)
    const projectedFixed = [];
    const projectedVariable = [];
    const projectedTotal = [];
  
    const remainingMonths = 12 - currentMonth; // Meses restantes no ano
  
    for (let j = 0; j < remainingMonths; j++) {
      projectedFixed.push(avgFixed);
      projectedVariable.push(avgVariable);
      projectedTotal.push(avgTotal);
    }
  
    return { projectedFixed, projectedVariable, projectedTotal };
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
