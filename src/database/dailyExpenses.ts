
import { dbPromise } from './database';

export const insertDailyExpenses = async (title: string, amount: number, categoryId: number, month: number, year: number, date: string) => {
    try {
        const db = await dbPromise;
        const day = String(new Date(date).getDate()).padStart(2, '0');        // π.χ. "03"
        const monthFinal = String(new Date(date).getMonth() + 1).padStart(2, '0'); // π.χ. "08"
        const yearFinal = new Date(date).getFullYear();                            // π.χ. 2025
        // console.log('Insert values----> ' + title + '|' + amount + "|" + categoryId + "|" + month + "|" + year + '|' + yearFinal + '-' + monthFinal + '-' + day)

        await db.runAsync(
            'INSERT INTO daily_expenses (title,amount,category_id,month,year,date) VALUES (?,?,?,?,?,?);',
            [title, Number(amount), categoryId, month, year, yearFinal + '-' + monthFinal + '-' + day]
        );
    } catch (error) {
        console.error('Insert error:', error);
        throw error;
    }
};

export const updateDailyExpenses = async (title: string, amount: number, categoryId: number, id: number, month: number, year: number, date: string) => {
    try {
        const db = await dbPromise;

        const day = String(new Date(date).getDate()).padStart(2, '0');        // π.χ. "03"
        const monthFinal = String(new Date(date).getMonth() + 1).padStart(2, '0'); // π.χ. "08"
        const yearFinal = new Date(date).getFullYear();                            // π.χ. 2025

        await db.runAsync(
            'UPDATE daily_expenses SET title =? ,amount=? ,category_id=?, month=?,year=?,date=? WHERE id = ?;',
            [title, amount, categoryId, month, year, yearFinal + '-' + monthFinal + '-' + day, id]
        );
    } catch (error) {
        console.error('Insert error:', error);
        throw error;
    }
};


export const getDailyExpenses = async (month: number, year: number) => {
    try {
        const db = await dbPromise;
        const result = await db.getAllAsync(
            'select a.id, title,amount,category_id,b.name as description,month,year,date, b.type from daily_expenses a, categories b where a.category_id = b.id and month=? and year=?', [month, year]
        );

        return result
    } catch (error) {
        console.error('get error:', error);
        throw error;
    }
};


export const deleteDailyExpenses = async (id: number) => {
    try {
        const db = await dbPromise;
        await db.runAsync(
            'Delete from daily_expenses where id =?', [id]
        );
    } catch (error) {
        console.error('get error:', error);
        throw error;
    }
}


export const deleteDailyExpensesAll = async () => {
    try {
        const db = await dbPromise;
        await db.runAsync(
            'Delete from daily_expenses ', []
        );
    } catch (error) {
        console.error('get error:', error);
        throw error;
    }
}

export const getWeeklySumsByMonth = async (month: string, year: string) => {
    try {
        const db = await dbPromise;
        const result = await db.getAllAsync(
            `SELECT 
                strftime('%W', date) AS week_number,
                date(date, 'weekday 0', '-6 days') AS week_start,
                date(date, 'weekday 0') AS week_end,
                SUM(amount) AS total
             FROM 
                daily_expenses
             WHERE 
                month = ? AND year = ?
             GROUP BY 
                week_number
             ORDER BY 
                week_number`,
            [month, year]
        );

        return result;
    } catch (error) {
        console.error("Error fetching weekly sums:", error);
        throw error;
    }
};

export const sumByMonthDaily = async (month: number) => {
    try {
        const db = await dbPromise;
        const result = await db.getAllAsync(
            `Select sum(amount) as total from daily_expenses where month=?`, [month]
        );

        return result
    } catch (error) {
        console.error('get error:', error);
        throw error;
    }
}