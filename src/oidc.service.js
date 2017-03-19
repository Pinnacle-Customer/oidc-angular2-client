"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@angular/core");
const router_1 = require("@angular/router");
const http_1 = require("@angular/http");
const Observable_1 = require("rxjs/Observable");
const security_constants_1 = require("./security.constants");
let AuthService = class AuthService {
    constructor(router, http, securityConstants) {
        this.router = router;
        this.http = http;
        this.securityConstants = securityConstants;
        this.headers = new http_1.Headers({ 'Accept': 'application/json', 'Content-Type': 'application/json' });
        this.options = new http_1.RequestOptions({ headers: this.headers });
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
            const timer = Observable_1.Observable.timer(this.securityConstants.SilentTokenStartAfter, this.securityConstants.SilentTokenIntervals);
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
            return Observable_1.Observable.throw(error.json().error || 'Server Error');
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
AuthService = __decorate([
    core_1.Injectable(),
    __metadata("design:paramtypes", [router_1.Router, http_1.Http, security_constants_1.SecurityConstants])
], AuthService);
exports.AuthService = AuthService;
//# sourceMappingURL=oidc.service.js.map