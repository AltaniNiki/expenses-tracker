
import { dbPromise } from './database';

export const insertFixedExpensesMonth = async (title: string, amount: number, categoryId: number, month: number, year: number) => {
    try {
        const db = await dbPromise;
        await db.runAsync(
            'INSERT INTO fixed_expenses_month (title,amount,category_id,month,year) VALUES (?,?,?,?,?);',
            [title, amount, categoryId, month, year]
        );
    } catch (error) {
        console.error('Insert error:', error);
        throw error;
    }
};

export const updateFixedExpensesMonth = async (title: string, amount: number, categoryId: number, id: number, month: number, year: number) => {
    try {
        const db = await dbPromise;
        await db.runAsync(
            'UPDATE fixed_expenses_month SET title =? ,amount=? ,category_id=?, month=?,year=? WHERE id = ?;',
            [title, amount, categoryId, month, year, id]
        );
    } catch (error) {
        console.error('Insert error:', error);
        throw error;
    }
};


export const getFixedExpensesMonth = async (month: number, year: number) => {
    try {
        const db = await dbPromise;
        const result = await db.getAllAsync(
            'select a.id, title,amount,category_id,b.name as description,month,year from fixed_expenses_month a, categories b where a.category_id = b.id and month=? and year =?', [month, year]
        );

        return result
    } catch (error) {
        console.error('get error:', error);
        throw error;
    }
};


export const deleteFixedExpensesMonth = async (id: number) => {
    try {
        const db = await dbPromise;
        await db.runAsync(
            'Delete from fixed_expenses_month where id =?', [id]
        );
    } catch (error) {
        console.error('get error:', error);
        throw error;
    }
}

export const deleteFixedExpensesMonthAll = async (id: number) => {
    try {
        const db = await dbPromise;
        await db.runAsync(
            'Delete from fixed_expenses_month', [id]
        );
    } catch (error) {
        console.error('get error:', error);
        throw error;
    }
}
