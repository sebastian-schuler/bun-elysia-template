// handlers/errorHandler.ts
import { type ErrorHandler } from 'elysia';
import { AppError, NotFoundError, ValidationError } from './errors';
import { log } from '../logger';
import { Serializable } from '~/types/utility/serializable';

export const errorHandler: ErrorHandler = ({ code, error, set, request }) => {
    const errorMessage =
        error instanceof Error ? error.message : typeof error === 'string' ? error : 'Unknown error occurred';
    const errorStack =
        error instanceof Error ? error.stack : typeof error === 'string' ? error : 'Unknown error stack';

    // Log the error with additional context
    if (code === 'UNKNOWN' || code === 'INTERNAL_SERVER_ERROR') {
        log.error({
            message: errorMessage,
            stack: errorStack,
            code,
            path: request.url,
            method: request.method,
            timestamp: new Date().toISOString(),
            ...(error instanceof AppError && {
                errorCode: error.errorCode,
                internalMessage: error.internalMessage,
            }),
        });
    }

    // Handle different error types
    if (error instanceof AppError) {
        set.status = error.statusCode;
        return error.toJSON();
    }

    // Handle Elysia's built-in errors
    let builtInError: ValidationError | NotFoundError | AppError;
    switch (code) {
        case 'VALIDATION':
            builtInError = new ValidationError(error.all as Serializable);
            break;

        case 'NOT_FOUND':
            builtInError = new NotFoundError(request.url);
            break;

        case 'INTERNAL_SERVER_ERROR':
        default:
            builtInError = new AppError(500, {
                errorCode: 'INTERNAL_SERVER_ERROR',
                publicMessage: 'Something went wrong',
                internalMessage: `Internal server error: ${errorMessage}`,
            });
            break;
    }

    set.status = builtInError.statusCode;
    return builtInError.toJSON();
};
