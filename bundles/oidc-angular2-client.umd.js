(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('@angular/core'), require('@angular/router'), require('@angular/http'), require('rxjs/Observable'), require('rxjs/add/observable/of'), require('rxjs/add/observable/throw'), require('rxjs/add/observable/timer'), require('rxjs/add/operator/catch'), require('rxjs/add/operator/do'), require('rxjs/add/operator/filter'), require('rxjs/add/operator/map')) :
	typeof define === 'function' && define.amd ? define(['exports', '@angular/core', '@angular/router', '@angular/http', 'rxjs/Observable', 'rxjs/add/observable/of', 'rxjs/add/observable/throw', 'rxjs/add/observable/timer', 'rxjs/add/operator/catch', 'rxjs/add/operator/do', 'rxjs/add/operator/filter', 'rxjs/add/operator/map'], factory) :
	(factory((global.oidcangular2client = global.oidcangular2client || {}),global.oidcangular2client.core,global.oidcangular2client.router,global.oidcangular2client.http,global.Rx));
}(this, (function (exports,_angular_core,_angular_router,_angular_http,rxjs_Observable) { 'use strict';

function __decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}

function __metadata(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}

let SecurityConstants = class SecurityConstants {
    constructor() {
        this.SilentTokenStartAfter = 1000;
        this.SilentTokenIntervals = 30000;
        this.TokenRenewBeforeSeconds = 90;
    }
};
SecurityConstants = __decorate([
    _angular_core.Injectable(), 
    __metadata('design:paramtypes', [])
], SecurityConstants);

exports.AuthService = class AuthService {
    constructor(router, http, securityConstants) {
        this.router = router;
        this.http = http;
        this.securityConstants = securityConstants;
        this.headers = new _angular_http.Headers({ 'Accept': 'application/json', 'Content-Type': 'application/json' });
        this.options = new _angular_http.RequestOptions({ headers: this.headers });
        this.storage = sessionStorage;
        this.runSilentTokenRenew();
    }
    getUserAuthorized() {
        return this.retrieve('userData') !== '';
    }
    getUserName() {
        return this.retrieve('userData') === '' ? '' : this.retrieve('userData').profile.name;
    }
    getAccessToken() {
        return this.retrieve('userData') === '' ? '' : this.retrieve('userData').access_token;
    }
    getTokenExpiresInSeconds() {
        return this.retrieve('userData') === '' ? 0 : this.retrieve('userData').expires_at - Math.floor(new Date().getTime() / 1000);
    }
    clearUserData() {
        this.store('userData', null);
    }
    signIn() {
        this.getOidcManager()
            .then((res) => {
            res.signinRedirect().then(() => {
            }).catch((err) => {
                console.log(err);
            });
        });
    }
    signOut() {
        this.getOidcManager()
            .then((res) => {
            res.signoutRedirect().then(() => {
                this.store('userData', null);
            }).catch((err) => {
                console.log(err);
            });
        });
    }
    ;
    signinRedirectCallback() {
        this.getOidcManager()
            .then((res) => {
            res.signinRedirectCallback().then(() => {
                res.getUser()
                    .then((user) => {
                    if (user) {
                        this.store('userData', user);
                        this.router.navigate(['/']);
                    }
                });
            });
        });
    }
    ;
    getOidcManager() {
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
    runSilentTokenRenew() {
        this.getConfigFile()
            .subscribe((data) => {
            if (!data.automaticSilentRenew) {
                console.log('Silent renew not configured');
                return;
            }
            const timer = rxjs_Observable.Observable.timer(this.securityConstants.SilentTokenStartAfter, this.securityConstants.SilentTokenIntervals);
            timer.subscribe(t => {
                const expiresIn = this.getTokenExpiresInSeconds();
                if (expiresIn) {
                    console.log(`Expires in: ${expiresIn}`);
                    if (expiresIn < this.securityConstants.TokenRenewBeforeSeconds) {
                        this.getOidcManager()
                            .then((res) => {
                            res.signinSilent().then((user) => {
                                console.log(user);
                                sessionStorage.setItem('userData', JSON.stringify(user));
                            }).catch((err) => {
                                console.log(err);
                            });
                        });
                    }
                }
                else {
                    console.log('no user');
                }
            });
        });
    }
    getConfigFile() {
        return this.http.get('oauthconfig.json', this.options)
            .map((response) => response.json())
            .catch((error) => {
            console.error(error);
            return rxjs_Observable.Observable.throw(error.json().error || 'Server Error');
        });
    }
    store(key, value) {
        this.storage.setItem(key, JSON.stringify(value));
    }
    retrieve(key) {
        const item = this.storage.getItem(key);
        if (item && item !== 'undefined' && item !== 'null') {
            return JSON.parse(this.storage.getItem(key));
        }
        return '';
    }
};
exports.AuthService = __decorate([
    _angular_core.Injectable(), 
    __metadata('design:paramtypes', [(typeof (_a = typeof _angular_router.Router !== 'undefined' && _angular_router.Router) === 'function' && _a) || Object, (typeof (_b = typeof _angular_http.Http !== 'undefined' && _angular_http.Http) === 'function' && _b) || Object, (typeof (_c = typeof SecurityConstants !== 'undefined' && SecurityConstants) === 'function' && _c) || Object])
], exports.AuthService);
var _a;
var _b;
var _c;

exports.HttpClientService = class HttpClientService {
    constructor(http, authService) {
        this.http = http;
        this.authService = authService;
    }
    createAuthorizationHeader(headers) {
        headers.append('Content-Type', 'application/json');
        headers.append('Accept', 'application/json');
        const token = this.authService.getAccessToken();
        if (token !== '') {
            const tokenValue = `Bearer ${token}`;
            headers.append('Authorization', tokenValue);
        }
    }
    get(url) {
        const headers = new _angular_http.Headers();
        this.createAuthorizationHeader(headers);
        return this.http.get(url, {
            headers: headers
        }).catch(err => this.handleError(err));
    }
    post(url, data) {
        const headers = new _angular_http.Headers();
        this.createAuthorizationHeader(headers);
        return this.http.post(url, data, {
            headers: headers
        }).catch(err => this.handleError(err));
    }
    put(url, data) {
        const headers = new _angular_http.Headers();
        this.createAuthorizationHeader(headers);
        return this.http.put(url, data, {
            headers: headers
        }).catch(err => this.handleError(err));
    }
    delete(url) {
        const headers = new _angular_http.Headers();
        this.createAuthorizationHeader(headers);
        return this.http.delete(url, {
            headers: headers
        }).catch(err => this.handleError(err));
    }
    handleError(error) {
        console.error(error);
        if (error.status === 401) {
            this.authService.clearUserData();
        }
        return rxjs_Observable.Observable.throw(error);
    }
};
exports.HttpClientService = __decorate([
    _angular_core.Injectable(), 
    __metadata('design:paramtypes', [(typeof (_a$1 = typeof _angular_http.Http !== 'undefined' && _angular_http.Http) === 'function' && _a$1) || Object, (typeof (_b$1 = typeof exports.AuthService !== 'undefined' && exports.AuthService) === 'function' && _b$1) || Object])
], exports.HttpClientService);
var _a$1;
var _b$1;

exports.SecurityComponent = class SecurityComponent {
    constructor(authService) {
        this.authService = authService;
    }
    ngOnInit() {
        if (window.location.hash) {
            this.authService.signinRedirectCallback();
        }
    }
};
exports.SecurityComponent = __decorate([
    _angular_core.Component({
        moduleId: 'SecurityComponent',
        template: '<div></div>'
    }), 
    __metadata('design:paramtypes', [(typeof (_a$2 = typeof exports.AuthService !== 'undefined' && exports.AuthService) === 'function' && _a$2) || Object])
], exports.SecurityComponent);
var _a$2;

let SecurityModule_1;
exports.SecurityModule = SecurityModule_1 = class SecurityModule {
    static forRoot() {
        return {
            ngModule: SecurityModule_1,
            providers: [
                exports.AuthService,
                exports.HttpClientService,
                SecurityConstants
            ]
        };
    }
};
exports.SecurityModule = SecurityModule_1 = __decorate([
    _angular_core.NgModule({
        imports: [
            _angular_router.RouterModule.forChild([
                { path: 'callback', component: exports.SecurityComponent }
            ])
        ],
        declarations: [
            exports.SecurityComponent
        ],
    }), 
    __metadata('design:paramtypes', [])
], exports.SecurityModule);

Object.defineProperty(exports, '__esModule', { value: true });

})));
//# sourceMappingURL=oidc-angular2-client.umd.js.map
