import { Serializable } from '~/types/utility/serializable';
import { randomString } from '~/utils/random-string';

type AppErrorProps = {
    errorCode?: string;
    severity?: 'low' | 'medium' | 'high' | 'critical';
    externalMessage: string | string[]; // Shown in response
    internalMessage?: string | string[]; // Only shown in log
    externalDetails?: Serializable; // Shown in response
    internalDetails?: Serializable; // Only shown in log
};

export class AppError extends Error {
    errorTag: string;
    errorCode?: string;
    severity: AppErrorProps['severity'];
    externalMessage: string | string[];
    internalMessage?: string | string[];
    externalDetails?: Serializable;
    internalDetails?: Serializable;

    constructor(
        public statusCode: number,
        props: AppErrorProps
    ) {
        const internalErrorMessage = props.internalMessage || props.externalMessage;
        super(Array.isArray(internalErrorMessage) ? internalErrorMessage.join(', ') : internalErrorMessage);
        this.statusCode = statusCode;
        this.severity = props.severity ?? 'low';
        this.errorTag = randomString(6);
        this.errorCode = props.errorCode;
        this.externalMessage = props.externalMessage;
        this.internalMessage = props.internalMessage;
        this.externalDetails = props.externalDetails;
        this.internalDetails = props.internalDetails;
    }

    toResponseJSON() {
        return {
            error: {
                tag: this.errorTag,
                code: this.errorCode,
                message: this.externalMessage,
                ...(this.externalDetails && { details: this.externalDetails }),
            },
        };
    }
}

export class NotFoundError extends AppError {
    constructor(resource: string, details?: Serializable) {
        super(404, {
            errorCode: 'RESOURCE_NOT_FOUND',
            externalMessage: `Resource not found: ${resource}`,
            internalDetails: details,
        });
    }
}

export class ValidationError extends AppError {
    constructor(details: Serializable) {
        super(404, {
            errorCode: 'VALIDATION_ERROR',
            externalMessage: 'Request validation failed',
            externalDetails: details,
        });
    }
}

export class UnauthorizedError extends AppError {
    constructor(message = 'Authentication required') {
        super(401, {
            errorCode: 'UNAUTHORIZED',
            externalMessage: message,
        });
    }
}
