import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthService } from './oidc.service';
import { HttpClientService } from './httpclient.service';
import {SecurityComponent} from './security.component';

@NgModule({
    imports:[
        RouterModule.forChild([
            { path: 'callback', component: SecurityComponent }
        ])
    ],
    declarations:[
        SecurityComponent 
    ],
    providers: [
         AuthService,
         HttpClientService
    ]
})

export class SecurityModule { }