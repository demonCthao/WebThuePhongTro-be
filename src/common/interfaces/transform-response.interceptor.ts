import {
    CallHandler,
    ExecutionContext,
    Injectable,
    NestInterceptor,
} from '@nestjs/common';

import { Observable, map } from 'rxjs';

import { DataResponse } from '../interfaces/data-response.interface.js';

@Injectable()
export class TransformResponseInterceptor<T>
    implements NestInterceptor<T, DataResponse<T>> {
    intercept(
        context: ExecutionContext,
        next: CallHandler,
    ): Observable<DataResponse<T>> {
        return next.handle().pipe(
            map((data: T) => ({
                success: true,
                data,
                message: 'Success',
            })),
        );
    }
}