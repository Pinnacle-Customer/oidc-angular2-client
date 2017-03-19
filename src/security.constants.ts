import {Injectable} from '@angular/core';

@Injectable()
export class SecurityConstants {
    public SilentTokenStartAfter: number = 1000;
    public SilentTokenIntervals: number = 30000;
    
    public TokenRenewBeforeSeconds: number = 90;
}