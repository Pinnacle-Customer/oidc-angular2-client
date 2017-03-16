import { NgModule, ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthService } from './oidc.service';
import { HttpClientService } from './httpclient.service';
import { SecurityComponent } from './security.component';
import { SecurityConstants } from './security.constants';

@NgModule({
    imports: [
        RouterModule.forChild([
            { path: 'callback', component: SecurityComponent }
        ])
    ],
    declarations: [
        SecurityComponent
    ],
})

export class SecurityModule {
    public static forRoot(): ModuleWithProviders {
        return {
            ngModule: SecurityModule,
            providers: [
                AuthService,
                HttpClientService,
                SecurityConstants
            ]
        };
    }
}