import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, tap } from 'rxjs';
import { PinoLoggerService } from './pino-logger.service';

@Injectable()
export class GrpcLoggingInterceptor implements NestInterceptor {
  constructor(private readonly logger: PinoLoggerService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const rpcName = context.getHandler().name;
    const serviceName = context.getClass().name;
    const startedAt = Date.now();

    this.logger.log(
      {
        transport: 'grpc',
        service: serviceName,
        rpc: rpcName,
      },
      'gRPC request started',
    );

    return next.handle().pipe(
      tap({
        next: () => {
          this.logger.log(
            {
              transport: 'grpc',
              service: serviceName,
              rpc: rpcName,
              durationMs: Date.now() - startedAt,
            },
            'gRPC request completed',
          );
        },

        error: (error: unknown) => {
          const err = error instanceof Error ? error : new Error(String(error));

          this.logger.error(err, `gRPC ${serviceName}.${rpcName} failed`);
        },
      }),
    );
  }
}
