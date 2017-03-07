"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@angular/core");
const router_1 = require("@angular/router");
const oidc_service_1 = require("./oidc.service");
const httpclient_service_1 = require("./httpclient.service");
const security_component_1 = require("./security.component");
const security_constants_1 = require("./security.constants");
let SecurityModule = SecurityModule_1 = class SecurityModule {
    static forRoot() {
        return {
            ngModule: SecurityModule_1,
            providers: [
                oidc_service_1.AuthService,
                httpclient_service_1.HttpClientService,
                security_constants_1.SecurityConstants
            ]
        };
    }
};
SecurityModule = SecurityModule_1 = __decorate([
    core_1.NgModule({
        imports: [
            router_1.RouterModule.forChild([
                { path: 'callback', component: security_component_1.SecurityComponent }
            ])
        ],
        declarations: [
            security_component_1.SecurityComponent
        ],
    })
], SecurityModule);
exports.SecurityModule = SecurityModule;
var SecurityModule_1;
//# sourceMappingURL=security.module.js.map