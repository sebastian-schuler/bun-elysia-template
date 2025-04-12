import { describe, expect, test } from 'bun:test';
import { app } from '~/index';
import { testingApiUrl } from './setup';

describe('GET /', () => {
    test('should return an array of customers', async () => {
        const response = await app.handle(
            new Request(testingApiUrl + '/customers', {
                method: 'GET',
            })
        );

        expect(response.status).toBe(200);
        const data = await response.json();
        for await (const customer of data) {
            expect(customer).toEqual({
                id: expect.any(String),
                name: expect.any(String),
                email: expect.any(String),
                creationDate: expect.any(String),
                // How to handle objects...
                // address: expect.objectContaining({
                //     street: expect.any(String),
                //     city: expect.any(String),
                //     zipCode: expect.any(String),
                // }),
            });
        }
    });
});
