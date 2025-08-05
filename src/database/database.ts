import * as SQLite from 'expo-sqlite'

export const dbPromise = SQLite.openDatabaseAsync('expenses');

export const initDatabase = async () => {
    try {
        const db = await dbPromise;


        console.log('------- initDatabase -------')
        await db.execAsync(`
            PRAGMA journal_mode = WAL;

            CREATE TABLE IF NOT EXISTS categories (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL,
                type INTEGER
            );

            CREATE TABLE IF NOT EXISTS fixed_expenses (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                title TEXT NOT NULL,
                amount REAL NOT NULL,
                category_id INTEGER
            );

            CREATE TABLE IF NOT EXISTS fixed_expenses_month (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                title TEXT NOT NULL,
                amount REAL NOT NULL,
                category_id INTEGER,
                month INTEGER,
                year INTEGER
            );

            CREATE TABLE IF NOT EXISTS daily_expenses (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                title TEXT NOT NULL,
                amount REAL NOT NULL,
                date TEXT NOT NULL,
                category_id INTEGER,
                year TEXT NOT NULL,
                month TEXT NOT NULL
            );

            CREATE TABLE IF NOT EXISTS monthly_incoming (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                title TEXT NOT NULL,
                amount REAL NOT NULL,
                date TEXT NOT NULL,
                month TEXT NOT NULL,
                category_id INTEGER,
                year TEXT NOT NULL
            );

            CREATE TABLE IF NOT EXISTS params (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                salary INTEGER NOT NULL,
                week_goal INTEGER NOT NULL
            );
            
            INSERT INTO params (salary, week_goal)
            SELECT 0, 0
            WHERE NOT EXISTS (SELECT 1 FROM params);
    `);
        console.log('📦 Database initialized successfully');
    } catch (error) {
        console.error('❌ Database initialization failed:', error);
    }
};