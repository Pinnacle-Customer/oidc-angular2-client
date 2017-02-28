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
const http_1 = require("@angular/http");
const Observable_1 = require("rxjs/Observable");
const oidc_service_1 = require("./oidc.service");
let HttpClientService = class HttpClientService {
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
            console.log(`tokenValue:${tokenValue}`);
            headers.append('Authorization', tokenValue);
        }
    }
    get(url) {
        const headers = new http_1.Headers();
        this.createAuthorizationHeader(headers);
        return this.http.get(url, {
            headers: headers
        }).catch(err => this.handleError(err));
    }
    post(url, data) {
        const headers = new http_1.Headers();
        this.createAuthorizationHeader(headers);
        return this.http.post(url, data, {
            headers: headers
        }).catch(err => this.handleError(err));
    }
    put(url, data) {
        const headers = new http_1.Headers();
        this.createAuthorizationHeader(headers);
        return this.http.put(url, data, {
            headers: headers
        }).catch(err => this.handleError(err));
    }
    delete(url) {
        const headers = new http_1.Headers();
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
        return Observable_1.Observable.throw(error.json().error || 'Server error');
    }
};
HttpClientService = __decorate([
    core_1.Injectable(),
    __metadata("design:paramtypes", [http_1.Http, oidc_service_1.AuthService])
], HttpClientService);
exports.HttpClientService = HttpClientService;
//# sourceMappingURL=httpclient.service.js.map