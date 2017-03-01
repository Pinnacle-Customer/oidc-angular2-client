import {Injectable} from '@angular/core'

@Injectable()
export class SecurityConstants {
    public readonly SilentTokenStartAfter = 1000;
    public readonly SilentTokenIntervals = 30000;
    
    public readonly TokenRenewBeforeSeconds = 90;
}