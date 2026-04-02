import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';
import { ApiResponseEnvelope } from './api-response.interface';

type ValidationErrorPayload = {
  message: string;
  error: Record<string, string>;
};

@Catch()
export class ApiExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost): void {
    const context = host.switchToHttp();
    const response = context.getResponse<Response>();
    const statusCode = this.getStatusCode(exception);
    const payload = this.createErrorPayload(exception, statusCode);

    response.status(statusCode).json(payload);
  }

  private getStatusCode(exception: unknown): number {
    if (exception instanceof HttpException) {
      return exception.getStatus();
    }

    return HttpStatus.INTERNAL_SERVER_ERROR;
  }

  private createErrorPayload(
    exception: unknown,
    statusCode: number,
  ): ApiResponseEnvelope<null, Record<string, string>> {
    if (exception instanceof HttpException) {
      const exceptionResponse = exception.getResponse();

      if (this.isValidationErrorPayload(exceptionResponse)) {
        return {
          success: false,
          message: exceptionResponse.message,
          data: null,
          error: exceptionResponse.error,
        };
      }

      const detailedMessage = this.extractMessage(
        exceptionResponse,
        exception.message,
      );

      if (statusCode >= 500) {
        return {
          success: false,
          message: 'server error!',
          data: null,
          error: {
            message: detailedMessage,
          },
        };
      }

      return {
        success: false,
        message: detailedMessage,
        data: null,
        error: {
          message: detailedMessage,
        },
      };
    }

    const detailedMessage =
      exception instanceof Error ? exception.message : 'failed message detail.';

    return {
      success: false,
      message: 'server error!',
      data: null,
      error: {
        message: detailedMessage,
      },
    };
  }

  private isValidationErrorPayload(
    value: unknown,
  ): value is ValidationErrorPayload {
    if (!value || typeof value !== 'object') {
      return false;
    }

    const maybePayload = value as Partial<ValidationErrorPayload>;

    return (
      typeof maybePayload.message === 'string' &&
      Boolean(maybePayload.error) &&
      typeof maybePayload.error === 'object'
    );
  }

  private extractMessage(
    exceptionResponse: string | object,
    fallbackMessage: string,
  ): string {
    if (typeof exceptionResponse === 'string') {
      return exceptionResponse;
    }

    if (
      'message' in exceptionResponse &&
      typeof exceptionResponse.message === 'string'
    ) {
      return exceptionResponse.message;
    }

    return fallbackMessage || 'failed message detail.';
  }
}
