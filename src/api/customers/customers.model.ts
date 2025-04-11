import { t } from 'elysia';

export const createCustomerBody = t.Object({
    email: t.String(),
    name: t.String(),
});
export type CreateCustomerBody = typeof createCustomerBody.static;

export const updateCustomerBody = t.Object({
    email: t.Optional(t.String()),
    name: t.Optional(t.String()),
});
export type UpdateCustomerBody = typeof updateCustomerBody.static;
