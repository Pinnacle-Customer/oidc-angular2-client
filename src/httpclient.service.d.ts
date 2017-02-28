import { Http, Headers, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { AuthService } from './oidc.service';
export declare class HttpClientService {
    private http;
    private authService;
    constructor(http: Http, authService: AuthService);
    createAuthorizationHeader(headers: Headers): void;
    get(url: string): Observable<Response>;
    post(url: string, data: any): Observable<Response>;
    put(url: string, data: any): Observable<Response>;
    delete(url: string): Observable<Response>;
    private handleError(error);
}
