import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import {environment} from "../../environments/environment";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class CredentialService {

  baseUrlSimple = environment.apiUrlSimple;

  constructor(private http: HttpClient) { }

  login(email: any, password: any): Observable<any> {
    return this.http.post(`${this.baseUrlSimple}/api/auth/login`, { email, password });
  }

  register(credential: any): Observable<any> {
    return this.http.post<any>(`${this.baseUrlSimple}/api/auth/login/${credential.platform}`, credential);
  }
}
