import { ArgumentsHost, Catch } from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';
import { Response } from 'express';
import { RpcException } from '@nestjs/microservices';
import { status } from 'grpc';

@Catch(RpcException)
export class RpcExceptionFilter extends BaseExceptionFilter {
  catch(exception: RpcException, host: ArgumentsHost) {
    const { getResponse } = host.switchToHttp();
    const response = getResponse<Response>();

    const code =
      typeof exception.getError() === 'object'
        ? (exception.getError() as any).code
        : -1;

    const codeMap: { [key: string]: { status: number; [key: string]: any } } = {
      deafult: {
        status: 400,
        message: exception.message,
      },
      [status.FAILED_PRECONDITION]: {
        status: 422,
        message: exception.message,
      },
    };

    const { status: httpStatus, ...error } = codeMap[code] || codeMap.deafult;
    return response.status(httpStatus).json({
      error: 'Not found.',
      message: exception.message,
      ...error,
      ...(process.env.NODE_ENV === 'development' && { stack: exception.stack }),
    });
  }
}
