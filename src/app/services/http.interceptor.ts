import { HttpErrorResponse, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material';
import { Router } from '@angular/router';
import { Observable, throwError } from 'rxjs';
import { catchError, switchMap, mergeMap } from 'rxjs/operators';
import { HttpProxyService } from './http-proxy.service';
/**
 * use refresh token if call failed
 */
@Injectable()
export class CustomHttpInterceptor implements HttpInterceptor {
  private _errorStatus: number[] = [500, 503, 502];
  constructor(private router: Router, private _httpProxy: HttpProxyService, private _snackBar: MatSnackBar) { }
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<any> {
    if (this._httpProxy.netImpl.currentUserAuthInfo && this._httpProxy.netImpl.currentUserAuthInfo.access_token && !this._httpProxy.expireRefresh)
      if (
        req.url.indexOf('oauth/token') > -1 && req.method === 'POST'
        ) {
        /**
         * skip Bearer header for public urls
         */
      } else {
        req = req.clone({ setHeaders: { Authorization: `Bearer ${this._httpProxy.netImpl.currentUserAuthInfo.access_token}` } });
      }
    return next.handle(req).pipe(catchError(error => {
      if (error instanceof HttpErrorResponse) {
        let httpError = error as HttpErrorResponse;
        if (httpError.status === 401) {
          if (this._httpProxy.netImpl.currentUserAuthInfo === undefined || this._httpProxy.netImpl.currentUserAuthInfo === null) {
            /** during log in call */
            this.openSnackbar('Bad Username or password');
            return throwError(error);
          }
          else if (this._httpProxy.netImpl.currentUserAuthInfo.access_token
            && this._httpProxy.netImpl.currentUserAuthInfo.refresh_token
            && !this._httpProxy.expireRefresh) {
            /** user already logged in */
            return this._httpProxy.netImpl.refreshToken().pipe(mergeMap(result => {
              this._httpProxy.expireRefresh = true;
              /**
               * get ride of duplicate jwt cookie
               */
              this._httpProxy.netImpl.currentUserAuthInfo = undefined;
              this._httpProxy.netImpl.currentUserAuthInfo = result;
              this._httpProxy.expireRefresh = false;
              req = req.clone({ setHeaders: { Authorization: `Bearer ${this._httpProxy.netImpl.currentUserAuthInfo.access_token}` } });
              return next.handle(req)
            }
            ))
          } else {
            this.openSnackbar('SESSION_EXPIRED');
            this.router.navigate(['/login'], { queryParams: this.router.routerState.snapshot.root.queryParams })
            document.cookie = "jwt=; expires=Thu, 01 Jan 1970 00:00:00 UTC;";
            return throwError(error);
          }
        } else if (this._errorStatus.indexOf(httpError.status) > -1) {
          this.openSnackbar('Server return 5xx');
        } else if (httpError.status === 404) {
          this.openSnackbar('URL Not Found');
          return throwError(error);
        } else if (httpError.status === 403) {
          this.openSnackbar('Access is not allowed');
          return throwError(error);
        } else if (httpError.status === 400) {
          this.openSnackbar('Invalid request');
          return throwError(error);
        } else if (httpError.status === 0) {
          this.openSnackbar('Network connection failed');
          return throwError(error);
        } else {
          return throwError(error);
        }

      }
    })

    );
  }
  openSnackbar(message: string) {
    this._snackBar.open(message, 'OK', {
      duration: 5000,
    });
  }
}