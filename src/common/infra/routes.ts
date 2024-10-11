import { routerAuth } from "@/modules/auth/infra/http/routes/AuthRoutes";
import { routerCreditCard } from "@/modules/CreditCardBill/infra/routes/routes";
import { routerFiance } from "@/modules/finance/infra/routes/routers";
import { routerFixedExpense } from "@/modules/fixedExpense/infra/routes/router";
import { routerRevenue } from "@/modules/revenue/infra/http/router/routers";
import { routerUser } from "@/modules/user/http/router/routers";
import { routerVariableExpense } from "@/modules/variableExpense/infra/http/router/router";
import { FastifyInstance } from "fastify";

export async function routes(app: FastifyInstance) {
    app.register(routerUser, { prefix: '/user' })
    app.register(routerAuth, { prefix: '/auth' })
    app.register(routerRevenue, { prefix: '/revenue' })
    app.register(routerFixedExpense, { prefix: '/fixed-expense' })
    app.register(routerVariableExpense, { prefix: '/variable-expense' })
    app.register(routerFiance, { prefix: '/finance' })
    app.register(routerCreditCard, { prefix: '/credit-card' })
}
