import { ArgumentsHost, Catch } from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';
import { Response } from 'express';
import { EntityNotFoundError } from 'typeorm';

@Catch(EntityNotFoundError)
export class EntityNotFoundExceptionFilter extends BaseExceptionFilter {
  catch(exception: EntityNotFoundError, host: ArgumentsHost) {
    const { getResponse } = host.switchToHttp();
    const response = getResponse<Response>();
    return response.status(404).json({
      error: 'Not found.',
      message: exception.message,
      ...(process.env.NODE_ENV === 'development' && { stack: exception.stack }),
    });
  }
}
