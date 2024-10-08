
export class RevenueDoesNotExist extends Error {
    constructor(private msg: string) {
        super(msg)
    }
}