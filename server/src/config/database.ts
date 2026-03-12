// server/src/config/database.ts
import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

export const pool = mysql.createPool({
    host: process.env.DB_HOST as string,
    user: process.env.DB_USER as string,
    password: process.env.DB_PASSWORD as string,
    database: process.env.DB_NAME as string,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    enableKeepAlive: true,    // Mencegah server cPanel memutus koneksi yang sedang diam (idle)
    keepAliveInitialDelay: 0,
    timezone: 'UTC'
});

const originalQuery = pool.query.bind(pool);
const originalExecute = pool.execute.bind(pool);

const applyRetry = async (operation: Function, sql: any, values?: any) => {
    const isSelect = typeof sql === 'string' && sql.trim().toUpperCase().startsWith('SELECT');
    const maxRetries = isSelect ? 3 : 1; 
    
    let attempt = 0;
    while (attempt < maxRetries) {
        try {
            return await operation(sql, values);
        } catch (error) {
            attempt++;
            if (attempt >= maxRetries) throw error; 
            
            console.warn(`⚠️ Koneksi terputus. Retry ${attempt}/${maxRetries} otomatis...`);
            await new Promise(res => setTimeout(res, 1000));
        }
    }
};

pool.query = (sql: any, values?: any) => applyRetry(originalQuery, sql, values) as any;
pool.execute = (sql: any, values?: any) => applyRetry(originalExecute, sql, values) as any;