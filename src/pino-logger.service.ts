import { Injectable, LoggerService } from '@nestjs/common';
import { PinoLogger, InjectPinoLogger } from 'nestjs-pino';

@Injectable()
export class PinoLoggerService implements LoggerService {
  constructor(
    @InjectPinoLogger(PinoLoggerService.name)
    private readonly logger: PinoLogger,
  ) {}

  log(message: string, context?: string): void;
  log(object: Record<string, unknown>, context?: string): void;
  log(
    messageOrObject: string | Record<string, unknown>,
    context?: string,
  ): void {
    const msg =
      typeof messageOrObject === 'string' ? messageOrObject : undefined;
    const obj =
      typeof messageOrObject === 'object' ? messageOrObject : undefined;

    this.logger.info({ context, ...obj }, msg);
  }

  error(message: string, trace?: string, context?: string): void;
  error(error: Error, context?: string): void;
  error(
    messageOrError: string | Error,
    traceOrContext?: string,
    context?: string,
  ): void {
    if (messageOrError instanceof Error) {
      this.logger.error(
        { context: traceOrContext, err: messageOrError },
        messageOrError.message,
      );
    } else if (typeof traceOrContext === 'string' && context === undefined) {
      this.logger.error(
        { context: undefined, err: new Error(traceOrContext) },
        messageOrError,
      );
    } else {
      this.logger.error({ context: traceOrContext }, messageOrError);
    }
  }

  warn(message: string, context?: string): void;
  warn(object: Record<string, unknown>, context?: string): void;
  warn(
    messageOrObject: string | Record<string, unknown>,
    context?: string,
  ): void {
    const msg =
      typeof messageOrObject === 'string' ? messageOrObject : undefined;
    const obj =
      typeof messageOrObject === 'object' ? messageOrObject : undefined;

    this.logger.warn({ context, ...obj }, msg);
  }

  debug(message: string, context?: string): void;
  debug(object: Record<string, unknown>, context?: string): void;
  debug(
    messageOrObject: string | Record<string, unknown>,
    context?: string,
  ): void {
    const msg =
      typeof messageOrObject === 'string' ? messageOrObject : undefined;
    const obj =
      typeof messageOrObject === 'object' ? messageOrObject : undefined;

    this.logger.debug({ context, ...obj }, msg);
  }

  verbose(message: string, context?: string): void;
  verbose(object: Record<string, unknown>, context?: string): void;
  verbose(
    messageOrObject: string | Record<string, unknown>,
    context?: string,
  ): void {
    const msg =
      typeof messageOrObject === 'string' ? messageOrObject : undefined;
    const obj =
      typeof messageOrObject === 'object' ? messageOrObject : undefined;

    this.logger.trace({ context, ...obj }, msg);
  }

  setContext(context: string): void {
    this.logger.assign({ context });
  }
}
