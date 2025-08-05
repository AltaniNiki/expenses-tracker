
import { dbPromise } from './database';

export const insertMonthlyIncoming = async (title: string, amount: number, categoryId: number, month: number, year: number, date: string) => {
    try {
        const db = await dbPromise;
        const day = String(new Date(date).getDate()).padStart(2, '0');        // π.χ. "03"
        const monthFinal = String(new Date(date).getMonth() + 1).padStart(2, '0'); // π.χ. "08"
        const yearFinal = new Date(date).getFullYear();

        await db.runAsync(
            'INSERT INTO monthly_incoming (title,amount,category_id,month,year,date) VALUES (?,?,?,?,?,?);',
            [title, amount, categoryId, month, year, yearFinal + '-' + monthFinal + '-' + day]
        );
    } catch (error) {
        console.error('Insert error:', error);
        throw error;
    }
};

export const updateMonthlyIncoming = async (title: string, amount: number, categoryId: number, id: number, month: number, year: number, date: string) => {
    try {
        const db = await dbPromise;
        const day = String(new Date(date).getDate()).padStart(2, '0');        // π.χ. "03"
        const monthFinal = String(new Date(date).getMonth() + 1).padStart(2, '0'); // π.χ. "08"
        const yearFinal = new Date(date).getFullYear();
        await db.runAsync(
            'UPDATE monthly_incoming SET title =? ,amount=? ,category_id=?, month=?,year=?,date=? WHERE id = ?;',
            [title, amount, categoryId, month, year, yearFinal + '-' + monthFinal + '-' + day, id]
        );
    } catch (error) {
        console.error('Insert error:', error);
        throw error;
    }
};


export const getMontlyIncoming = async (month: number, year: number) => {
    try {
        const db = await dbPromise;
        const result = await db.getAllAsync(
            'select a.id, title,amount,category_id,b.name as description,a.date from monthly_incoming a, categories b where a.category_id = b.id and month=? and year=?', [month, year]
        );

        return result
    } catch (error) {
        console.error('get error:', error);
        throw error;
    }
};


export const deleteMonthlyIncmoming = async (id: number) => {
    try {
        const db = await dbPromise;
        await db.runAsync(
            'Delete from monthly_incoming where id =?', [id]
        );
    } catch (error) {
        console.error('get error:', error);
        throw error;
    }
}

