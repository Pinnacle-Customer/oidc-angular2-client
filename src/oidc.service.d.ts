import { Router } from '@angular/router';
import { Http } from '@angular/http';
export declare class AuthService {
    private router;
    private http;
    private mgr;
    private storage;
    private headers;
    private options;
    constructor(router: Router, http: Http);
    getUserAuthorized(): boolean;
    getUserName(): string;
    getAccessToken(): string;
    getTokenExpiresInSeconds(): number;
    clearUserData(): void;
    signIn(): void;
    signOut(): void;
    signinRedirectCallback(): void;
    private getOidcManager();
    private runSilentTokenRenew();
    private store(key, value);
    private retrieve(key);
}
