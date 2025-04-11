import { CamelCasePlugin, DeduplicateJoinsPlugin, Kysely, PostgresDialect } from "kysely";
import { Pool } from "pg";
import { DB } from "./types";

export const db = new Kysely<DB>({
    dialect: new PostgresDialect({
        pool: new Pool({
            connectionString: process.env.DATABASE_URL,
        }),
    }),
    plugins: [new CamelCasePlugin(), new DeduplicateJoinsPlugin()],
    log: ["error"],
}).withSchema("testing");
