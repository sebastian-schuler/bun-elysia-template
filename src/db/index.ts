import { CamelCasePlugin, DeduplicateJoinsPlugin, Kysely, PostgresDialect } from 'kysely';
import { Pool } from 'pg';
import { DB } from './types';

export const createDb = async () => {
    try {
        const pool = new Pool({
            connectionString: process.env.DATABASE_URL,
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
    } catch (error) {
        console.error('❌ Failed to connect to database:');
        console.error(error);
        process.exit(1);
    }
};

export const db = await createDb();
