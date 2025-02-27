type users = {
    [key: string]: {
        email: string;
        password: string;
        balance: number;
        phone: string;
        transactions: {
            amount: number;
            type: string;
            date: string;
            account: string;
        }[];
    };
};

const usersData: users = {};


export { usersData, users };