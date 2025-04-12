import { Serializable } from '~/types/utility/serializable';
import { randomString } from '~/utils/random-string';

type AppErrorProps = {
    errorCode: string;
    publicMessage: string | string[];
    internalMessage?: string | string[];
    externalDetails?: Serializable;
    internalDetails?: Serializable;
};

export class AppError extends Error {
    errorTag: string;
    errorCode: string;
    publicMessage: string | string[];
    internalMessage?: string | string[];
    externalDetails?: Serializable;
    internalDetails?: Serializable;

    constructor(
        public statusCode: number,
        props: AppErrorProps
    ) {
        const internalErrorMessage = props.internalMessage || props.publicMessage;
        super(Array.isArray(internalErrorMessage) ? internalErrorMessage.join(', ') : internalErrorMessage);
        this.statusCode = statusCode;
        this.errorTag = randomString(6);
        this.errorCode = props.errorCode;
        this.publicMessage = props.publicMessage;
        this.internalMessage = props.internalMessage;
        this.externalDetails = props.externalDetails;
        this.internalDetails = props.internalDetails;
    }

    toJSON() {
        return {
            error: {
                tag: this.errorTag,
                code: this.errorCode,
                message: this.publicMessage,
                ...(this.internalDetails && { details: this.internalDetails }),
                timestamp: new Date().toISOString(),
            },
        };
    }
}

export class NotFoundError extends AppError {
    constructor(resource: string, details?: Serializable) {
        super(404, {
            errorCode: 'RESOURCE_NOT_FOUND',
            publicMessage: `Resource not found: ${resource}`,
            internalDetails: details,
        });
    }
}

export class ValidationError extends AppError {
    constructor(details: Serializable) {
        super(404, {
            errorCode: 'VALIDATION_ERROR',
            publicMessage: 'Request validation failed',
            externalDetails: details,
        });
    }
}

export class UnauthorizedError extends AppError {
    constructor(message = 'Authentication required') {
        super(401, {
            errorCode: 'UNAUTHORIZED',
            publicMessage: message,
        });
    }
}
