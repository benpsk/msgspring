import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { map, Observable } from 'rxjs';
import { ApiResponseEnvelope } from './api-response.interface';
import { RESPONSE_MESSAGE_METADATA_KEY } from './response-message.decorator';

@Injectable()
export class ApiResponseInterceptor<TData>
  implements NestInterceptor<TData, ApiResponseEnvelope<TData>>
{
  constructor(private readonly reflector: Reflector) {}

  intercept(
    context: ExecutionContext,
    next: CallHandler<TData>,
  ): Observable<ApiResponseEnvelope<TData>> {
    const message =
      this.reflector.getAllAndOverride<string>(RESPONSE_MESSAGE_METADATA_KEY, [
        context.getHandler(),
        context.getClass(),
      ]) ?? 'request completed successfully.';

    return next.handle().pipe(
      map((data) => ({
        success: true,
        message,
        data: data ?? null,
        error: null,
      })),
    );
  }
}
