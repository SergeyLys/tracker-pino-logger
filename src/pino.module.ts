import { Global, Module } from '@nestjs/common';
import { LoggerModule as NestJsPinoModule } from 'nestjs-pino';
import { PinoLoggerService } from './pino-logger.service';

@Global()
@Module({
  imports: [
    NestJsPinoModule.forRoot({
      pinoHttp: {
        transport:
          process.env.NODE_ENV !== 'production'
            ? {
                target: 'pino-pretty',
                options: {
                  colorize: true,
                  translateTime: 'SYS:standard',
                  ignore: 'pid,hostname',
                },
              }
            : undefined,

        level: process.env.LOG_LEVEL ?? 'info',
        autoLogging: true,
        name: process.env.SERVICE_NAME ?? 'tracker',
      },
    }),
  ],
  providers: [PinoLoggerService],
  exports: [PinoLoggerService, NestJsPinoModule],
})
export class PinoLoggerModule {}
