import { Selectable } from 'kysely';
import { db } from '~/db';
import { Customer } from '~/db/types';
import { CreateCustomerBody, UpdateCustomerBody } from './customers.model';

export abstract class CustomerService {
    static async getUsers(): Promise<Selectable<Customer>[]> {
        const users = await db.selectFrom('customers').selectAll().execute();
        return users;
    }

    static async getUserById(id: string): Promise<Selectable<Customer> | undefined> {
        const user = await db.selectFrom('customers').selectAll().where('id', '=', id).executeTakeFirst();
        return user;
    }

    static async createUser(newUser: CreateCustomerBody) {
        const users = await db
            .insertInto('customers')
            .values({
                id: crypto.randomUUID(),
                creationDate: new Date(),
                ...newUser,
            })
            .execute();
        return users;
    }

    static async updateUser(id: string, newUser: UpdateCustomerBody) {
        const updateQuery = db.updateTable('customers').where('id', '=', id);

        if (newUser.name) updateQuery.set('name', newUser.name);
        if (newUser.email) updateQuery.set('email', newUser.email);

        const updateResult = await updateQuery.executeTakeFirst();
        return updateResult;
    }

    static async deleteUser(id: string) {
        const deleteQuery = await db.deleteFrom('customers').where('id', '=', id).executeTakeFirst();
        return deleteQuery;
    }
}
