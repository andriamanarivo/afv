import { Injectable } from '@angular/core';
import { Router, CanActivate } from '@angular/router';
import { AuthenticationApplicatifService } from '.';


@Injectable()
export class SplashGuardApplicatifService  implements CanActivate {

  constructor(private authApplicatifService: AuthenticationApplicatifService, private router: Router) { }
  canActivate(): boolean {
    //if (sessionStorage.getItem('id_token')) {
    //console.log("SplashGuardApplicatifService");
    
    
    if (this.authApplicatifService.loggedIn()) {
        //this.router.navigate(['/home']);
        //console.log("loggedIn");
        return true;
    }
    else {
      //console.log("splashcreen");
      this.router.navigate(['/splashcreen']).then(() => {
        console.log('splash guard');
      });
      return false;
    }
    
  }
}
