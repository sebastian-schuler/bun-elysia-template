import swagger from '@elysiajs/swagger';
import Elysia from 'elysia';
import { v1Routes } from './api';
import { env } from './config/env';
import cors from '@elysiajs/cors';
import { helmet } from 'elysia-helmet';

const server = new Elysia({ name: 'Server' })

    // Middleware
    .use(cors())
    .use(helmet())
    .use(swagger())
    .onError(({ code, error }) => {
        console.log('HAHA');
        return new Response(error.toString());
    })

    // Routes
    .use(v1Routes);

server.listen({ port: env.PORT }, ({ hostname, port }) => {
    const url = env.NODE_ENV === 'production' ? 'https' : 'http';
    console.info(`✅ Elysia is running at ${url}://${hostname}:${port}`);
    console.info(`✅ Swagger available at ${url}://${hostname}:${port}/swagger`);
});
