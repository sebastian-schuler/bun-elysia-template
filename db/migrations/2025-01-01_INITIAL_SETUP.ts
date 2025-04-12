import { Kysely, sql } from 'kysely';

export async function up(db: Kysely<any>): Promise<void> {
    const testing = db.withSchema('testing');

    await testing.schema
        .createTable('customers')
        .addColumn('id', 'uuid', (col) => col.primaryKey())
        .addColumn('name', 'varchar', (col) => col.notNull())
        .addColumn('email', 'varchar', (col) => col.notNull())
        .addColumn('creation_date', 'timestamp', (col) => col.defaultTo(sql`now()`).notNull())
        .execute();
}

export async function down(db: Kysely<any>): Promise<void> {
    const testing = db.withSchema('testing');

    await testing.schema.dropTable('customers').execute();
}
