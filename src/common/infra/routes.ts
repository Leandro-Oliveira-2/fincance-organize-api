import { routerAuth } from "@/modules/auth/infra/http/routes/AuthRoutes";
import { routerRevenue } from "@/modules/revenue/infra/http/router/routers";
import { routerUser } from "@/modules/user/http/router/routers";
import { FastifyInstance } from "fastify";

export async function routes(app: FastifyInstance) {
    app.register(routerUser, { prefix: '/user' })
    app.register(routerAuth, { prefix: '/auth' })
    app.register(routerRevenue, { prefix: '/revenue' })
}
