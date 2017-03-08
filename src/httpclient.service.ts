import { Injectable } from '@angular/core';
import { Http, Headers, Response } from '@angular/http';

import { Observable } from 'rxjs/Observable';
import { AuthService } from './oidc.service';

@Injectable()
export class HttpClientService {

  constructor(private http: Http, private authService: AuthService) {}

  createAuthorizationHeader(headers: Headers) {
    headers.append('Content-Type', 'application/json');
    headers.append('Accept', 'application/json');

    const token = this.authService.getAccessToken();
    if (token !== '') {
        const tokenValue = `Bearer ${token}`;
        headers.append('Authorization', tokenValue);
    }
  }

  get(url : string): Observable<Response> {
    const headers = new Headers();
    this.createAuthorizationHeader(headers);
    return this.http.get(url, {
      headers: headers
    }).catch(err => this.handleError(err));
  }

  post(url: string, data: any): Observable<Response> {
    const headers = new Headers();
    this.createAuthorizationHeader(headers);
    return this.http.post(url, data, {
      headers: headers
    }).catch(err => this.handleError(err));
  }

  put(url: string, data: any): Observable<Response> {
      const headers = new Headers();
      this.createAuthorizationHeader(headers);
      return this.http.put(url, data, {
          headers: headers
      }).catch(err => this.handleError(err));
  }

  delete(url: string): Observable<Response> {
      const headers = new Headers();
      this.createAuthorizationHeader(headers);
      return this.http.delete(url, {
          headers: headers
      }).catch(err => this.handleError(err));
  }
    
  private handleError(error: Response) {
        console.error(error);
        if (error.status === 401) { this.authService.clearUserData(); }
        return Observable.throw(error);
  }
}