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
        id: number;
        description: string;
        amount: number;
        createdAt: Date;
        dueDate?: string;
        isPaid: boolean;
        category?: string;
        isFixed: boolean;
    }[];
    variableExpenses: {
        id: number;
        description: string;
        amount: number;
        createdAt: Date;
        paymentMethod: string;
        isPaid: boolean;
        category?: string;
    }[];
}
