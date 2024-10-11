
export class CreditCardBillNotFoundError extends Error {
    constructor(private msg: string) {
        super(msg)
    }
}