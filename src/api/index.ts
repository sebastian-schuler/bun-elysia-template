import Elysia from 'elysia';
import { CustomersController } from '~/api/customers/customers.controller';

export const v1Routes = new Elysia({ prefix: '/api/v1' }).use(CustomersController);
