import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
} from '@nestjs/common';
import { NotFoundError } from '@core/shared/domain/errors';

@Catch(NotFoundError)
export class NotFoundErrorFilter<T extends Error> implements ExceptionFilter {
  public catch(
    exception: T,
    host: ArgumentsHost,
  ): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const status = 404;
    response.status(status).json({
      statusCode: status,
      error: 'Not Found',
      message: exception.message,
    });
  }
}
