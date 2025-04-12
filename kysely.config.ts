import 'dotenv/config';
import { CamelCasePlugin, DeduplicateJoinsPlugin, PostgresDialect } from 'kysely';
import { defineConfig } from 'kysely-ctl';
import { Pool } from 'pg';

export default defineConfig({
    dialect: new PostgresDialect({
        pool: new Pool({
            host: process.env.DB_HOST,
            database: process.env.DB_NAME,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            port: Number(process.env.DB_PORT) || 5432,
            max: 10,
        }),
    }),
    migrations: {
        migrationFolder: './db/migrations',
    },
    plugins: [new CamelCasePlugin(), new DeduplicateJoinsPlugin()],
    seeds: {
        seedFolder: './db/seeds',
    },
});
