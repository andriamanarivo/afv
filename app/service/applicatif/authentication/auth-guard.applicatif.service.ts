import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthenticationApplicatifService } from '.';
import { UtilisateurApplicatifServiceACI } from '../utilisateur/utilisateur.applicatif.service.aci';
import { tokenNotExpired, JwtHelper } from 'angular2-jwt';
import { SharedService } from '../../../commun/shared-service';


@Injectable()
export class AuthGuardApplicatif implements CanActivate {
    constructor(private shardeService: SharedService,
        private jwtHelper: JwtHelper,
        private authApplicatifService: AuthenticationApplicatifService,
        private router: Router, private userService: UtilisateurApplicatifServiceACI) {

        }
    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot){
        // this.shardeService.closeAllModal.next(true);
        const isLogged = this.authApplicatifService.islogged();
        if (isLogged === undefined) {
            this.router.navigate(['/splashcreen']).then(() => {
                console.log('********************** ====================');
                console.log('********************** can activate');
                location.reload();
            });
            return false;
        } else if (isLogged) {
             return true;
            // return this.verifyUser();
        } else {
            this.router.navigate(['/splashcreen'], { queryParams: { tokenExpired: true } })
            .then(() => {
                console.log('********************** ====================');
                console.log('********************** can activate');
                location.reload();
            });
            return false;
        }
    }

    verifyUser() {
        const token = sessionStorage.getItem('id_token');
        const currentUser = this.jwtHelper.decodeToken(token);
        return this.userService.verifySuspendedUser(currentUser.uid).map(res => {
            if (!res.isSuspend) {
                 return true;
            }else {
                const alertMesage = `Vous n’avez pas respecté nos CGU et/ou notre charte de déontologie. 
                    Indiquer la durée / Si vous désirez demander une réactivation de votre compte, 
                    contactez l’editeur info@domi.com du site`;
                alert(alertMesage);
                
                sessionStorage.removeItem('id_token');
                sessionStorage.removeItem('rfIuid');
                sessionStorage.removeItem('allUnreadMessageCount');
                this.router.navigate(['/splashcreen']);
                return false;
            }
        });
    }

}
