import { Value } from '@sinclair/typebox/value';
import { t } from 'elysia';
import { log } from '~/middleware/logger';

export const envSchema = t.Object({
    // App
    PORT: t.Number({ minimum: 1, maximum: 65535 }),
    NODE_ENV: t.Union([t.Literal('development'), t.Literal('production'), t.Literal('uat')]),

    // Database
    DB_NAME: t.String(),
    DB_HOST: t.String(),
    DB_PORT: t.Number({ minimum: 1, maximum: 65535 }),
    DB_USER: t.String(),
    DB_PASSWORD: t.String(),

    // Computed properties
    isDev: t.Boolean(),
    isProd: t.Boolean(),
});

function getEnvironmentVariables() {
    const envData = {
        PORT: Number(process.env.PORT),
        NODE_ENV: process.env.NODE_ENV,

        // Database
        DB_HOST: process.env.DB_HOST,
        DB_PORT: Number(process.env.DB_PORT),
        DB_USER: process.env.DB_USER,
        DB_PASSWORD: process.env.DB_PASSWORD,
        DB_NAME: process.env.DB_NAME,

        // App
        isDev: process.env.NODE_ENV === 'development',
        isProd: process.env.NODE_ENV === 'production',
    };

    const checkResult = Value.Check(envSchema, envData);

    if (!checkResult) {
        const errors = [...Value.Errors(envSchema, envData)];
        log.error(errors, 'Environment variables are incorrect');
        process.exit(1);
    }

    return envData;
}

export const env = getEnvironmentVariables();
