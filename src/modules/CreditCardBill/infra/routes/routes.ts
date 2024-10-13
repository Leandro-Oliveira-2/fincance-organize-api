import { FastifyInstance } from "fastify";
import container from "@/common/container";
import Types from "@/common/container/types";
import { CreditCardBillController } from "../controllers/creditCartBillController";

export async function routerCreditCard(app: FastifyInstance) {
    const creditCardController = container.get<CreditCardBillController>(Types.CreditCardBillController);

    app.post("/create", creditCardController.create.bind(creditCardController));
    app.patch("/update", creditCardController.update.bind(creditCardController));
    app.post("/list", creditCardController.list.bind(creditCardController));
}
