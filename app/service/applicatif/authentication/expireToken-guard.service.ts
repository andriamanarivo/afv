import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { tokenNotExpired, JwtHelper } from 'angular2-jwt';
import { SharedService } from 'app/commun';


@Injectable()
export class ExpireTokenGuard implements CanActivate {
    constructor(private shardeService: SharedService, private jwtHelper: JwtHelper) { }
    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        //Fermer les modals
        this.shardeService.closeAllModal.next(true);
        return true;
    }

}