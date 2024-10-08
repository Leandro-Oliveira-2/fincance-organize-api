
export class FixedExpenseDoesNotExist extends Error {
    constructor(private msg: string) {
        super(msg)
    }
}