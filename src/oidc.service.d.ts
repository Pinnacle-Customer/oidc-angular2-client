import { Router } from '@angular/router';
import { Http } from '@angular/http';
import { SecurityConstants } from './security.constants';
export declare class AuthService {
    private router;
    private http;
    private securityConstants;
    private mgr;
    private storage;
    private headers;
    private options;
    constructor(router: Router, http: Http, securityConstants: SecurityConstants);
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
    private getConfigFile();
    private store(key, value);
    private retrieve(key);
}
