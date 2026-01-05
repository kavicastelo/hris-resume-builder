import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HttpClient, HttpResponse } from '@angular/common/http';
import { catchError, map, Observable, switchMap, throwError, BehaviorSubject, finalize, tap } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';
import { WindowService } from '../services/common/window.service';


@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  private baseUrlSimple = environment.apiUrlSimple;

  private refreshTokenInProgress: boolean = false;
  private refreshTokenSubject: BehaviorSubject<any> = new BehaviorSubject<any>(null);

  constructor(
    private authService: AuthService,
    private windowService: WindowService,
    private http: HttpClient,
    private router: Router
  ) { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const isFirebasePublicUrl = request.url.includes('firebasestorage.googleapis.com');
    const isRefreshRequest = request.url.includes('/auth/refresh-token');
    const isExternalSvg = request.url.startsWith('https://tb-cdn.netlify.app/');

    let sessionId = '';
    if (this.windowService.nativeSessionStorage) {
      sessionId = sessionStorage.getItem("session_id") || '';
    }

    // For refresh requests, firebase and other specific ends remove auth headers and credentials
    if (isFirebasePublicUrl || isRefreshRequest || isExternalSvg) {
      return next.handle(request.clone({ withCredentials: false }));
    }

    // For all other requests, add full headers
    const offset = String(new Date().getTimezoneOffset());

    request = request.clone({
      setHeaders: {
        'X-Session-Id': sessionId,
        'X-Offset': offset
      },
      withCredentials: true
    });

    return next.handle(request).pipe(
      catchError((error) => {
        if (error.status === 401 && error.error?.error === 'Token has expired') {
          return this.handleTokenExpiration(request, next);
        } else {
          return throwError(error);
        }
      })
    );
  }

  private handleTokenExpiration(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    let sessionId = '';
    if (this.windowService.nativeSessionStorage) {
      sessionId = sessionStorage.getItem("session_id") || '';
    }

    if (!this.refreshTokenInProgress) {
      this.refreshTokenInProgress = true;

      this.refreshToken().pipe(
        switchMap((newToken: string) => {
          // Retry the original request with the new token and headers
          request = request.clone({
            setHeaders: {
              Authorization: `Bearer ${newToken}`,
              'X-Session-Id': sessionId,
              'X-Offset': String(new Date().getTimezoneOffset())
            },
            withCredentials: true
          });
          return next.handle(request);
        }),
        catchError((refreshError) => {
          this.authService.logout();
          this.authService.redirectToLogin();
          return throwError(refreshError);
        }),
        finalize(() => {
          this.refreshTokenInProgress = false;
          this.refreshTokenSubject.next(null);
        })
      ).subscribe();
    }

    return this.refreshTokenSubject.pipe(
      switchMap(() => {
        request = request.clone({
          setHeaders: {
            'X-Session-Id': sessionId,
            'X-Offset': String(new Date().getTimezoneOffset())
          },
          withCredentials: true
        });
        return next.handle(request);
      })
    );
  }

  private refreshToken(): Observable<string> {
    return this.http.post<{ token: string }>(`${this.baseUrlSimple}/api/auth/refresh-token`, {}, { withCredentials: true }).pipe(
      map((response) => {
        const newToken = response.token;
        this.authService.createAuthToken(newToken);
        this.refreshTokenSubject.next(newToken);
        return newToken;
      })
    );
  }
}
