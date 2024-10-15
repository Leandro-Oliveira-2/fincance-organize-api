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
        dueDate?: string;
        isPaid: boolean;
        category?: string;
    }[];
    variableExpenses: {
        description: string;
        amount: number;
        createdAt: Date;
        paymentMethod: string;
        isPaid: boolean;
        category?: string;
    }[];
}
