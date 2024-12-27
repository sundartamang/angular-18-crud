import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { catchError, retry, throwError } from 'rxjs';
import { HttpStatusCode } from '../models';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
    return next(req).pipe(
        retry(3),
        catchError((error: HttpErrorResponse) => {
            let errorMessage = 'An unexpected error occurred!';

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

            console.warn(errorMessage);
            return throwError(() => new Error(errorMessage));
        })
    );
};

