import { Injectable } from '@angular/core';
import { Router, CanActivate } from '@angular/router';
import { JwtHelper } from 'angular2-jwt';
import { AuthenticationApplicatifService } from '.';

@Injectable()
export class AdminGuardApplicatif implements CanActivate {
  currentUser: any;
  constructor(private authApplicatifService: AuthenticationApplicatifService, private router: Router,private jwtHelper:JwtHelper) {}
  canActivate(): boolean {
    const isLogged = this.authApplicatifService.islogged();
    const token = sessionStorage.getItem('id_token');
    if (isLogged === undefined) {
          this.router.navigate(['/login']);
        return false;
    } else if (isLogged) {
      this.currentUser = this.jwtHelper.decodeToken(token);
      if (this.currentUser.roles.indexOf('ADMINISTRATEUR') !== -1 ) {
        return true;
      }
      return false;
    } else {
        this.router.navigate(['/login'], { queryParams: { tokenExpired: true }});
        return false;
    }

  }

 
}
