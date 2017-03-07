import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import { OidcClient } from 'oidc-client';
import { SecurityConstants } from './security.constants'

@Injectable()
export class AuthService {
    private mgr: any; 
    private storage: any;
    private headers = new Headers({ 'Accept': 'application/json', 'Content-Type': 'application/json' });
    private options = new RequestOptions({ headers: this.headers });

    constructor(private router: Router, private http: Http, private securityConstants: SecurityConstants) {
        this.storage = sessionStorage;
        this.runSilentTokenRenew();
    }    

    getUserAuthorized() : boolean {
        return this.retrieve('userData') !== '';
    }
    
    getUserName() : string {
        return this.retrieve('userData') === '' ? '' : this.retrieve('userData').profile.name;
    }
    
    getAccessToken(): string {
        return this.retrieve('userData') === '' ? '' : this.retrieve('userData').access_token;
    }

    getTokenExpiresInSeconds(): number {
        return this.retrieve('userData') === '' ? 0 : this.retrieve('userData').expires_at - Math.floor(new Date().getTime() / 1000);
    }
    
    clearUserData() {
        this.store('userData', null);
    }

    signIn() {
        this.getOidcManager()
            .then((res: any) => {
                res.signinRedirect().then(() => {
                    }).catch((err: any) => {
                        console.log(err);
                    });
            });
    }

    signOut() {
        this.getOidcManager()
            .then((res: any) => {
                res.signoutRedirect().then(() => {
                    this.store('userData', null);
                }).catch((err: any) => {
                    console.log(err);
                });
            });
    };

    signinRedirectCallback() {
        this.getOidcManager()
            .then((res: any) => {
                res.signinRedirectCallback().then(() => {
                    res.getUser()
                        .then((user: any) => {
                            if (user) {
                                this.store('userData', user);
                                this.router.navigate(['/']);
                            }
                        });
                });
            });
    };

    private getOidcManager() {
        return new Promise((resolve, reject) => {
            
            if (this.mgr) {
                resolve(this.mgr);
                return;
            }

            this.getConfigFile()
                .subscribe((data) => {
                    this.mgr = new Oidc.UserManager(data);
                    resolve(this.mgr);
            });
        });
    }

    private runSilentTokenRenew(): void {
        this.getConfigFile()
            .subscribe((data) => {
                if(!data.automaticSilentRenew){
                    console.log('Silent renew not configured')
                    return;
                }

                const timer = Observable.timer(this.securityConstants.SilentTokenStartAfter, 
                this.securityConstants.SilentTokenIntervals);
        
                timer.subscribe(t=> {
                    const expiresIn = this.getTokenExpiresInSeconds();
                    
                    if (expiresIn) {
                        console.log(`Expires in: ${expiresIn}`);
                        if (expiresIn < this.securityConstants.TokenRenewBeforeSeconds) {
                            this.getOidcManager()
                                .then((res: any) => {
                                    res.signinSilent().then((user: any) => {
                                        console.log(user);
                                        sessionStorage.setItem('userData', JSON.stringify(user));
                                    }).catch((err: any) => {
                                        console.log(err);
                                    });
                                });
                        }
                    } else {
                        console.log('no user');
                    }
                });
            });
    }

    private getConfigFile(): Observable<any>{
        return this.http.get('oauthconfig.json', this.options)
            .map((response: Response) => response.json())
            .catch((error: any) => {
                console.error(error);
                return Observable.throw(error.json().error || 'Server Error');
            });            
    }

    private store(key: string, value: any) {
        this.storage.setItem(key, JSON.stringify(value));
    }

    private retrieve(key: string): any {
        const item = this.storage.getItem(key);

        if (item && item !== 'undefined' && item !== 'null') {
            return JSON.parse(this.storage.getItem(key));
        }
        return '';
    }
}