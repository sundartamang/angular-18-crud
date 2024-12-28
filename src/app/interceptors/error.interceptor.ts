import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { catchError, retry, throwError } from 'rxjs';
import { inject } from '@angular/core';
import { HttpStatusCode } from '../models';
import { NotificationService } from '../services';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
    const notificationService = inject(NotificationService);
    return next(req).pipe(
        retry(3),
        catchError((error: HttpErrorResponse) => {
            let errorMessage: string = 'An unexpected error occurred!';

            switch (error.status) {
                case HttpStatusCode.Forbidden:
                    errorMessage = 'You do not have permission to access this resource.';
                    break;
                case HttpStatusCode.ServiceUnavailable:
                    errorMessage = 'Service unavailable! Please try again later.';
                    break;
                case HttpStatusCode.InternalServerError:
                    errorMessage = 'Internal Server Error. Please try again later.';
                    break;
                case HttpStatusCode.NetworkError:
                    errorMessage = 'Network error. Please check your internet connection.';
                    break;
                case HttpStatusCode.NotFound:
                    errorMessage = 'Resource not found!';
                    break;
                default:
                    errorMessage = `Error: ${error.statusText || 'Unknown error'}`;
                    break;
            }
            notificationService.showNotification(errorMessage, true);
            return throwError(() => new Error(errorMessage));
        })
    );
};
