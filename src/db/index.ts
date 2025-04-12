import { CamelCasePlugin, DeduplicateJoinsPlugin, Kysely, PostgresDialect } from 'kysely';
import { Pool } from 'pg';
import { DB } from './types';
import { env } from '~/config/env';

export const createDb = async () => {
    try {
        const pool = new Pool({
            host: env.DB_HOST,
            database: env.DB_NAME,
            user: env.DB_USER,
            password: env.DB_PASSWORD,
            port: env.DB_PORT,
            max: 10,
        });

        // Test the connection with a simple query
        const client = await pool.connect();
        try {
            await client.query('SELECT 1');
            console.info('✅ Database connection established');
        } finally {
            client.release();
        }

        const db = new Kysely<DB>({
            dialect: new PostgresDialect({ pool }),
            plugins: [new CamelCasePlugin(), new DeduplicateJoinsPlugin()],
            log: ['error'],
        }).withSchema('testing');

        return db;
    } catch (e) {
        console.error('❌ Failed to connect to database:', e instanceof Error ? e.message : '');
        process.exit(1);
    }
};

export const db = await createDb();
