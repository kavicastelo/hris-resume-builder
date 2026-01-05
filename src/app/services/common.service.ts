import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CommonService {

  apiUrl = environment.apiUrl
  apiUrlSimple = environment.apiUrlSimple

  constructor(private http: HttpClient) { }

  sendRequest(data: any) {
    const headers = new HttpHeaders({
      'Authorization': 'Basic ' + btoa('admin:password')
    });
    return this.http.post(this.apiUrl + '/email/cv-request', {
      name: data.name,
      email: data.email,
      dob: data.dob,
      careerStage: data.careerStage,
      jobTitle: data.jobTitle,
      link: data.link,
      message: data.message
    }, { headers });
  }

  subscribeNewsLatter(email: string): Observable<any> {
    return this.http.put(`${this.apiUrl}/news-latter/subscribe`, { email: email });
  }

  sendWelcomeEmail(email: string): Observable<any> {
    return this.http.put(`${this.apiUrl}/email/send-welcome-cv`, { email: email });
  }

  getSession(): Observable<any> {
    return this.http.get<any>(`${this.apiUrlSimple}/sso/session`, { withCredentials: true });
  }

  getTokens(email: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrlSimple}/api/auth/getTokens/${email}`, { withCredentials: true });
  }

  logout(): Observable<any> {
    return this.http.get(`${this.apiUrlSimple}/sso/logout`, { withCredentials: true });
  }
}
