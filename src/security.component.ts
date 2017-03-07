import { Component, OnInit } from '@angular/core';
import { AuthService } from './oidc.service';

@Component({
    moduleId: 'SecurityComponent',
    template: '<div></div>'
})

export class SecurityComponent implements OnInit{
    
    constructor(private authService: AuthService){}

    ngOnInit(): void {
        if (window.location.hash) {
            this.authService.signinRedirectCallback();
        }
    }
}