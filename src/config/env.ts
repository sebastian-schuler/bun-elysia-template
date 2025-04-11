export const env = {
    PORT: process.env.PORT || 3000,
    NODE_ENV: process.env.NODE_ENV || 'development',

    // Database
    DB_TYPE: process.env.DB_TYPE || 'mongo',
    DB_HOST: process.env.DB_HOST || 'localhost',
    DB_PORT: parseInt(process.env.DB_PORT || '27017'),
    DB_USER: process.env.DB_USER || 'root',
    DB_PASSWORD: process.env.DB_PASSWORD || 'password',
    DB_NAME: process.env.DB_NAME || 'elysia_app',
    MONGO_URI: process.env.MONGO_URI || 'mongodb://localhost:27017/elysia_app',

    // Auth
    JWT_SECRET: process.env.JWT_SECRET || 'your_super_secret_key',
    JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '7d',

    // App
    isDev: process.env.NODE_ENV === 'development',
    isProd: process.env.NODE_ENV === 'production',
};
