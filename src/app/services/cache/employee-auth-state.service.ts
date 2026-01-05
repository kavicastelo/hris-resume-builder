import { Injectable } from '@angular/core';
import { BehaviorSubject, catchError, map, Observable, of, tap } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { AuthService } from '../auth.service';

@Injectable({
  providedIn: 'root'
})
export class EmployeeAuthStateService {

  private _employeeSubject = new BehaviorSubject<any | null>(null);
  private _ambassadorSubject = new BehaviorSubject<any>(null);
  employee$ = this._employeeSubject.asObservable();
  ambassador$ = this._ambassadorSubject.asObservable();
  isLoggedIn$ = this.employee$.pipe(
    map(profile => !!profile?.employee?.id)
  );
  isAmbassador$ = this.ambassador$.pipe(
    map(profile => !!profile?.id && !!profile?.active)
  );

  baseUrl = environment.apiUrl;

  constructor(private http: HttpClient, private cookieService: AuthService) { }

  /**
   * Initialize user from cookie (on app load)
   */
  initializeUser(): Observable<any | null> {
    const employeeId = this.cookieService.userID();
    if (!employeeId) {
      this._employeeSubject.next(null);
      return of(null);
    }

    return this.http.get<any>(`${this.baseUrl}/batch/async/getEmployee/${employeeId}`).pipe(
      tap(profile => {
        this._employeeSubject.next(profile);
        this.initializeAmbassador(profile?.auth?.ambassadorId).subscribe()
      }),
      catchError(error => {
        console.error('[Auth] Failed to load employee profile', error);
        this._employeeSubject.next(null);
        return of(null);
      })
    );
  }

  initializeAmbassador(ambId: any): Observable<any> {
    if (ambId == null) return of(null);
    return this.http.get(`${this.baseUrl}/ambassador/profile/get/${ambId}`).pipe(
      tap(amb => this._ambassadorSubject.next(amb)),
      catchError(error => {
        console.error('[Auth] Failed to load ambassador profile', error);
        this._ambassadorSubject.next(null);
        return of(null);
      })
    );
  }

  /**
   * Initialize user from cookie/token, or clear it if invalid.
   */
  initializeFromCookie(employee: any): void {
    if (employee) {
      this._employeeSubject.next(employee);
    } else {
      this._employeeSubject.next(null);
    }
  }

  /**
   * Expose snapshot for sync usage
   */
  get isLoggedIn(): boolean {
    return !!this._employeeSubject.value;
  }

  /**
   * Expose snapshot for sync usage
   */
  get currentUser(): any | null {
    return this._employeeSubject.value;
  }

  /**
   * Manual refresh (e.g., after profile update)
   */
  refreshUser(): Observable<any | null> {
    return this.initializeUser();
  }

  /**
   * Logout cleanup
   */
  clearUser() {
    this._employeeSubject.next(null);
    this._ambassadorSubject.next(null);
  }

}
