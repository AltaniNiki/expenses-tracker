import { dbPromise } from './database';

export const updateParams = async (salary: number, weekGoal: number) => {
    try {
        console.log('salary--->', salary, ' week ---->', weekGoal)
        const db = await dbPromise;
        await db.runAsync(
            'UPDATE params SET salary = ?, week_goal = ? WHERE id = 1;',
            [salary, weekGoal]
        );
    } catch (error) {
        console.error('Update error:', error);
        throw error;
    }
};

export const getParams = async () => {
    try {
        const db = await dbPromise;
        const result = await db.getFirstAsync(
            'select id, salary,week_goal from params where id =1'
        );
        return result;
    } catch (error) {
        console.error('Update error:', error);
        throw error;
    }
};