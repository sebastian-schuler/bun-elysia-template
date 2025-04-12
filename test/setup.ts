import { afterEach, beforeEach, afterAll, beforeAll } from 'bun:test';

export const testingApiUrl = `http://localhost/api/v1`;

beforeAll(() => {
    console.info('[STARTING TESTS]');
});

afterAll(() => {
    console.info('[FINISHED TESTS]');
});

beforeEach(() => {});

afterEach(() => {});
