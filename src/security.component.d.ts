import { OnInit } from '@angular/core';
import { AuthService } from './oidc.service';
export declare class SecurityComponent implements OnInit {
    private authService;
    constructor(authService: AuthService);
    ngOnInit(): void;
}
