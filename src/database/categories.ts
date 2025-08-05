
import { dbPromise } from './database';


export const insertCategories = async (name: string, type: number) => {
    try {
        const db = await dbPromise;
        await db.runAsync(
            'INSERT INTO categories (name, type) VALUES (?, ?);',
            [name, type]
        );
    } catch (error) {
        console.error('Insert error:', error);
        throw error;
    }
};

export const updateCategory = async (id: number, name: string, type: number) => {
    try {
        const db = await dbPromise;
        await db.runAsync(
            'UPDATE categories SET name = ?, type = ? WHERE id = ?;',
            [name, type, id]
        );
    } catch (error) {
        console.error('Update error:', error);
        throw error;
    }
};

export const getCategories = async (type: string | null = null) => {
    try {
        const db = await dbPromise;
        const sql = type
            ? 'SELECT * FROM categories WHERE type = ?'
            : 'SELECT * FROM categories';
        const params = type ? [type] : [];

        const result = await db.getAllAsync(sql, params);
        return result;
    } catch (error) {
        console.error('Select error:', error);
        throw error;
    }
};


export const deleteCategory = async (id: number) => {
    try {
        const db = await dbPromise;
        await db.runAsync('DELETE FROM categories WHERE id = ?;', [id]);
    } catch (error) {
        console.error('Delete error:', error);
        throw error;
    }
};