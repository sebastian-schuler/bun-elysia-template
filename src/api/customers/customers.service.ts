import { Selectable } from 'kysely';
import { db } from '~/db';
import { Customer } from '~/db/types';
import { CreateCustomerBody, UpdateCustomerBody } from './customers.model';

export abstract class CustomerService {
    static async getCustomers(): Promise<Selectable<Customer>[]> {
        const customers = await db
            .selectFrom('customers')
            .selectAll()
            .execute()
            .catch((err) => {
                throw new Error(err);
            });
        return customers;
    }

    static async getCustomerById(id: string): Promise<Selectable<Customer> | undefined> {
        const customer = await db
            .selectFrom('customers')
            .selectAll()
            .where('id', '=', id)
            .executeTakeFirst()
            .catch((err) => {
                throw new Error(err);
            });
        return customer;
    }

    static async createCustomer(newCustomer: CreateCustomerBody) {
        const newId = crypto.randomUUID();
        const createResult = await db
            .insertInto('customers')
            .values({
                id: newId,
                creationDate: new Date().toISOString(),
                ...newCustomer,
            })
            .executeTakeFirst()
            .catch((err) => {
                throw new Error(err);
            });

        return { createResult, newId };
    }

    static async updateCustomer(id: string, updatedCustomer: UpdateCustomerBody) {
        let updateQuery = db.updateTable('customers');

        if (updatedCustomer.name) updateQuery = updateQuery.set('name', updatedCustomer.name);
        if (updatedCustomer.email) updateQuery = updateQuery.set('email', updatedCustomer.email);

        const updateResult = await updateQuery
            .where('id', '=', id)
            .returningAll()
            .executeTakeFirst()
            .catch((err) => {
                throw new Error(err);
            });

        return updateResult;
    }

    static async deleteUser(id: string) {
        const deleteQuery = await db
            .deleteFrom('customers')
            .where('id', '=', id)
            .executeTakeFirst()
            .catch((err) => {
                throw new Error(err);
            });
        return deleteQuery;
    }
}
