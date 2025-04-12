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
    if (
        (code === 'UNKNOWN' || code === 'INTERNAL_SERVER_ERROR') &&
        error instanceof AppError &&
        error.severity !== 'low' // Low severity will not be displayed in the log (e.g. user input error)
    ) {
        log.error({
            message: errorMessage,
            code,
            errorLocation: getErrorLineNumber(errorStack!),
            path: request.url,
            method: request.method,
            timestamp: new Date().toISOString(),
            ...(error instanceof AppError && {
                errorCode: error.errorCode,
                internalMessage: error.internalMessage,
            }),
            stack: errorStack,
        });
    }

    // Handle different error types
    if (error instanceof AppError) {
        set.status = error.statusCode;
        return error.toResponseJSON();
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
                externalMessage: 'Something went wrong',
                internalMessage: `Internal server error: ${errorMessage}`,
            });
            break;
    }

    set.status = builtInError.statusCode;
    return builtInError.toResponseJSON();
};

const getErrorLineNumber = (errorStack: string) => {
    const stackLines = errorStack?.split('\n');

    // Filter out stack lines related to the getErrorLineNumber function
    const relevantLines = stackLines
        ?.slice(1)
        .filter((line) => !line.includes('getErrorLineNumber') && line.includes('.ts'));

    const resultLines: string[] = [];

    for (const line of relevantLines) {
        const trimmedLine = line.trim();

        // Extract the file path and line number (and possibly column number)
        let match = trimmedLine.match(/\((.*):(\d+):(\d+)\)$/);

        if (!match) {
            // If the error is not a custom error, use a different regex to get the file path
            match = trimmedLine.match(/at (.*):(\d+):(\d+)$/);
        }

        if (match) {
            const filePath = match[1]; // Replace backslash because windows
            const lineNumber = match[2];
            const columnNumber = match[3];

            // Format using ANSI escape codes for hyperlinking
            const fileLink = `${filePath}:${lineNumber}:${columnNumber}`;
            resultLines.push(fileLink);
        }
    }

    return resultLines.join('\n');
};
