import swagger from '@elysiajs/swagger';
import Elysia from 'elysia';
import { v1Routes } from './api';
import { env } from './config/env';
import cors from '@elysiajs/cors';
import { helmet } from 'elysia-helmet';
import { errorHandler } from './middleware/error-handling/error-handler';
import { log } from './middleware/logger';

export const app = new Elysia({ name: 'Server' })
    // Middleware
    .use(
        log.into({
            autoLogging: {
                ignore(ctx) {
                    if (ctx.isError) return true;
                    return false;
                },
            },
        })
    )
    .use(cors())
    .use(helmet())
    .use(swagger())
    .onError((props) => errorHandler(props))

    // Routes
    .use(v1Routes)

    .listen({ port: env.PORT }, ({ hostname, port }) => {
        const url = env.NODE_ENV === 'production' ? 'https' : 'http';
        console.info(`✅ Elysia is running at ${url}://${hostname}:${port}`);
        console.info(`✅ Swagger available at ${url}://${hostname}:${port}/swagger`);
    });
