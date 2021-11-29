import {
    HttpEvent,
    HttpInterceptor,
    HttpHandler,
    HttpRequest,
    HttpResponse,
    HttpErrorResponse
} from '@angular/common/http';
import { Observable, throwError, Subject } from 'rxjs';
import { retry, catchError, takeUntil } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { AlertServiceService } from '../modules/shared/services/alert-service.service';
import { RequestIntercepterService } from './request-intercepter.service'; 

@Injectable()
export class HttpErrorInterceptor implements HttpInterceptor {

    constructor(
        private alertService:AlertServiceService, private requestIntercepterService: RequestIntercepterService
    ) {
     
    }
    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return next.handle(request)
            .pipe(
                retry(0),
                catchError((error: HttpErrorResponse) => {
                    let errorMessage = '';
                    if (error.error instanceof ErrorEvent) {
                        // client-side error
                        errorMessage = `Error: ${error.error.message}`;
                        console.log(errorMessage);
                    } else {
                        // server-side error
                        // this.loaderService.stopLoading();
                        if (error.error) {
                            console.log(error.error);
                            if(error.error.detail){
                                if(error.error.detail =="JWT error: ExpiredSignatureError")
                                {
                                  //const accessToken = localStorage.getItem('AccessToken');
                                  this.requestIntercepterService.RefreshAccessToken(request, next);          
                                }else{
                                    this.alertService.error(error.error.detail);
                                }
                            }
                            
                            // if (error.error.errorCode === 'APP08') {
                            //     this.alertService.error(error.error.messages);
                            // } else if (error.error.errorCode === 'APP56') {
                            //     this.translateErrorMessageWithVariables(error.error.data);
                            // } else {
                            //     this.alertService.error(this.translateService.instant('messages.' + error.error.errorCode));
                            // }
                        } else {
                            //this.alertService.error(this.translateService.instant('messages.serviceUnavailable'));
                        }
                        if(error.error.detail =="JWT error: ExpiredSignatureError" || error.error.detail == "Authentication credentials were not provided.")
                        {
                            location.reload();
                        }
                        errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
                        console.log(errorMessage);
                    }
                    return throwError(errorMessage);
                })
            );
    }
}