
import { dbPromise } from './database';



export const insertFixedExpenses = async (title: string, amount: number, categoryId: number) => {
    try {
        const db = await dbPromise;
        await db.runAsync(
            'INSERT INTO fixed_expenses (title,amount,category_id) VALUES (?, ?,?);',
            [title, amount, categoryId]
        );
    } catch (error) {
        console.error('Insert error:', error);
        throw error;
    }
};

export const updateFixedExpenses = async (title: string, amount: number, categoryId: number, id: number) => {
    try {
        const db = await dbPromise;
        await db.runAsync(
            'UPDATE fixed_expenses SET title =? ,amount=? ,category_id=? WHERE id = ?;',
            [title, amount, categoryId, id]
        );
    } catch (error) {
        console.error('Insert error:', error);
        throw error;
    }
};


export const getFixedExpenses = async () => {
    try {
        const db = await dbPromise;
        const result = await db.getAllAsync(
            'select a.id, title,amount,category_id,b.name as description from fixed_expenses a, categories b where a.category_id = b.id'
        );

        return result
    } catch (error) {
        console.error('get error:', error);
        throw error;
    }
};


export const deleteFixedExpenses = async (id: number) => {
    try {
        const db = await dbPromise;
        await db.runAsync(
            'Delete from fixed_expenses where id =?', [id]
        );
    } catch (error) {
        console.error('get error:', error);
        throw error;
    }
}