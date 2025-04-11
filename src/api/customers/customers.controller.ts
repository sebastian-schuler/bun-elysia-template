import Elysia, { t } from 'elysia';
import { CustomerService } from './customers.service';
import { createCustomerBody, updateCustomerBody } from './customers.model';

export const CustomersController = new Elysia({ prefix: '/users' })
    .get('/', () => CustomerService.getUsers())
    .post('/', ({ body }) => CustomerService.createUser(body), {
        body: createCustomerBody,
    })
    .get('/:id', ({ params }) => CustomerService.getUserById(params.id), {
        params: t.Object({
            id: t.String({ format: 'uuid' }),
        }),
    })
    .put('/:id', ({ params, body }) => CustomerService.updateUser(params.id, body), {
        params: t.Object({
            id: t.String({ format: 'uuid' }),
        }),
        body: updateCustomerBody,
    })
    .delete('/:id', ({ params }) => CustomerService.deleteUser(params.id), {
        params: t.Object({
            id: t.String({ format: 'uuid' }),
        }),
    });
