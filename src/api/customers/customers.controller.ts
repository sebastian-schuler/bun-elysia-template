import Elysia, { t } from 'elysia';
import { isDefined } from 'ts-scribe/typeguards';
import { AppError } from '~/middleware/error-handling/errors';
import { createCustomerBody, updateCustomerBody } from './customers.model';
import { CustomerService } from './customers.service';

export const CustomersController = new Elysia({ prefix: '/customers' })
    .get('/', async () => {
        const customers = await CustomerService.getCustomers();
        return { data: customers };
    })
    .post(
        '/',
        async ({ body, set }) => {
            const { newId, createResult } = await CustomerService.createCustomer(body);

            if (createResult.numInsertedOrUpdatedRows === 0n) {
                throw new AppError(500, {
                    externalMessage: 'An error occurred when trying to insert a new customer.',
                    severity: 'high',
                });
            }

            set.status = 201;
            return { data: { message: 'New customer successfully created.', newCustomerId: newId } };
        },
        {
            body: createCustomerBody,
        }
    )
    .get(
        '/:id',
        async ({ params }) => {
            const customer = await CustomerService.getCustomerById(params.id);
            if (isDefined(customer)) return { data: customer };
            throw new AppError(404, { externalMessage: 'No customer with that ID found.' });
        },
        {
            params: t.Object({
                id: t.String({ format: 'uuid' }),
            }),
        }
    )
    .put(
        '/:id',
        async ({ params, body }) => {
            const updateResult = await CustomerService.updateCustomer(params.id, body);

            return { data: { message: 'Customer successfully updated.', updatedCustomer: updateResult } };
        },
        {
            params: t.Object({
                id: t.String({ format: 'uuid' }),
            }),
            body: updateCustomerBody,
        }
    )
    .delete(
        '/:id',
        async ({ params }) => {
            const deleteResult = await CustomerService.deleteUser(params.id);

            if (deleteResult.numDeletedRows === 0n) {
                throw new AppError(500, {
                    externalMessage: 'Deletion failed. No customer with that ID found.',
                    externalDetails: {
                        customerId: params.id,
                    },
                });
            }

            return { data: { message: 'User successfully deleted.', deletedUserId: params.id } };
        },
        {
            params: t.Object({
                id: t.String({ format: 'uuid' }),
            }),
        }
    );
