import { Injectable } from '@angular/core';
import { EmployeeModel } from "../shared/data-models/Employee.model";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import {BehaviorSubject, catchError, Observable, tap, throwError} from "rxjs";
import { environment } from "../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {

  baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  // BehaviorSubject to store the employee data
  private employeeSubject = new BehaviorSubject<EmployeeModel | null>(null);
  employee$ = this.employeeSubject.asObservable();

  private cacheInitialized = false;

  // Fetch all employee-related data asynchronously (from async batch API) with caching
  fetchFullEmployee(id: any): Observable<any> {

    // Use the cache if initialized
    if (this.cacheInitialized) {
      return this.employee$; // Return the cached employee data as observable
    }

    // Fetch from API and cache
    return this.http.get<any>(`${this.baseUrl}/batch/async/getEmployee/${id}`).pipe(
      tap((data) => {
        this.employeeSubject.next(data); // Cache main employee data
        this.cacheInitialized = true;
      }),
      catchError((error) => {
        return throwError(error); // Re-throw the error so that the component can handle it
      })
    );
  }
}
