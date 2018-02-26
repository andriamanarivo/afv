import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { AuthenticationApplicatifService } from '../service/applicatif/authentication';
import { SharedService } from '../commun/shared-service';
import { SharedDataService } from '../presentation/shared/service/shared-data.service';
import { Router } from '@angular/router';

@Injectable()
export class LogoutService {
    constructor(
        private authApplicatifService: AuthenticationApplicatifService,
        private sharedDataService: SharedDataService,
        private router: Router,

        public sharedService: SharedService
    ) {

    }

    public logout() {
        const isLogout = true;
        this.authApplicatifService.updateConnectionStatus('0').subscribe(status => {
            console.log(status);
          });

        this.sharedService.setActivateIdle = false;

 
        sessionStorage.setItem('waitingLogout', '1');

        sessionStorage.removeItem('ctJid');
        sessionStorage.removeItem('rfIl');
        sessionStorage.removeItem('rfIp');
         sessionStorage.removeItem('isPseudo');
         sessionStorage.removeItem('im');
        this.sharedService.setTchatMessageCount = 0;
        this.sharedDataService.inscriptionConfirm.next({message: '', hasError: false});
        this.sharedDataService.resetPassword.next({message: '', hasError: false});

        sessionStorage.removeItem('allUnreadMessageCount');
        sessionStorage.removeItem('id_token');
        sessionStorage.removeItem('rfIuid');
        
        this.sharedService.setChatDisconnection(true);

        this.router.navigate(['/splashcreen']).then(() => {
            location.reload();
            this.sharedService.setLogout = false;
            this.sharedService.setChatDisconnection(false);
            console.log('reload et relocation header');
        });
    }
}
