export interface IResponse {
    user: {
        id: number;
        name: string;
        email: string;
        profession?: string;
        createdAt: Date;
        updatedAt: Date;
    };
    fixedExpenses: {
        description: string;
        amount: number;
        createdAt: Date;
    }[];
    variableExpenses: {
        description: string;
        amount: number;
        createdAt: Date;
    }[];
}
