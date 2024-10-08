import { routerAuth } from "@/modules/auth/infra/http/routes/AuthRoutes";
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
}
