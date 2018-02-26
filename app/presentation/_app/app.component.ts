import { Component , HostBinding ,NgZone,  HostListener} from '@angular/core';
import {IntervalObservable} from 'rxjs/observable/IntervalObservable'

import {ConstantService} from '../../contrainte/config/_app/constant.service';
import { TranslateService, LangChangeEvent } from 'ng2-translate';
import { SharedService } from '../../commun/shared-service';

import { AppConfig } from '../../contrainte/config/_app/app.config';
import { Observable } from 'rxjs/Observable';
import { SessionStorage,SessionStorageService } from 'ngx-webstorage';
import { tokenNotExpired, JwtHelper } from 'angular2-jwt';

import { Router } from '@angular/router';
import {Idle, DEFAULT_INTERRUPTSOURCES,  } from '../../commun/custom-idle';
import { CryptionAesService } from '../../commun/cryption-aes.service';
import { environment } from '../../../environments/environment';

/* import { environment } from '../../../environments/environment'; */

import { AuthenticationApplicatifServiceACI
 } from '../../service/applicatif/authentication';
import { HomeApplicatifServiceACI } from 'app/service/applicatif/home';

@Component({
    host: {
        '(document:click)': 'onClick($event)',
    },
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})

export class AppComponent {
    @HostListener('window:beforeunload', [ '$event' ])
    beforeUnloadHander(event) {
        this.sharedService.setChatDisconnection(true);
        const encryptedUid = sessionStorage.getItem('rfIuid');
        this.userUid = this.cryptionAesService.decryptMessage(encryptedUid);
        const connectionStatusUrl = this.baseUrlApp + 'connexion/statut/update/' + this.userUid;
        const userData =  {
            'statut': '0'
        };
        // console.log(connectionStatusUrl, ' data ', userData);
        const xhr = new XMLHttpRequest();
        xhr.open('POST', connectionStatusUrl, false);
        xhr.send(JSON.stringify(userData));
        return null;
    }



    public title = 'BDM Application';
    public timer: any;
    baseUrlApp;

    idleState = 'Not started.';
    userUid;

    isUserLogged = false;
    timedOut = false;
    lastPing?: Date = null;
    nbTouch = 0;

    constructor(public constantService: ConstantService,
    public sharedService: SharedService,
    public authApplicatifService: AuthenticationApplicatifServiceACI,
    private homeApplicatifServiceACI: HomeApplicatifServiceACI,
    public appConfig: AppConfig,
        private zone: NgZone,
        private translate: TranslateService,
        private jwtHelper: JwtHelper,
        private idle: Idle,
        private router: Router,
        private cryptionAesService: CryptionAesService) {
        let i = 1;
        this.zone.runOutsideAngular(() => {
            this.timer = Observable.interval(300000).subscribe(() => {
                this.zone.run(() => {
                    i = i + 1;
                    const log = this.islogged();
                    if (!log || i === 11) {
                        i = 0;
                        this.logout();                        
                        //if (this.nbTouch >= 1) {
                            //refresh token
                            // this.nbTouch = 0;
                            // const infosUsers = {
                            //     idSite: this.appConfig.getSiteIdByLocation(),
                            //     email: this.cryptionAesService.decryptMessage(sessionStorage.getItem('rfMl'))
                            // }
                            // this.homeApplicatifServiceACI.refreshToken(infosUsers)
                            //     .subscribe(res => {
                            //         console.log(res);
                            //     }, err => {
                            //         console.log(err);
                            //     });
                        // } else {
                        //     this.logout();
                        // }
                    }
                });
            });
        });
        // translate desactivé temporairerement
        // this language will be used as a fallback when a translation isn't found in the current language
        /* if (this.translate.currentLang === undefined) {
            translate.setDefaultLang('fr');
            // the lang to use, if the lang isn't available, it will use the current loader to get them
            translate.use('fr');
        } */

        translate.setDefaultLang('fr');
        translate.use('fr');
        const logged = this.islogged();
        this.isUserLogged = logged !== undefined && logged;
        this.handleIdle();        
        this.baseUrlApp = environment.baseUrlAppUrl;
    }

    onClick(event): void{
        if(this.islogged()){
            console.log("clic");
            this.nbTouch++;   
            console.log(this.cryptionAesService.decryptMessage(sessionStorage.getItem('rfMl')));        
        }
    }
  
    public logout() {
        // update connection status
        this.authApplicatifService.updateConnectionStatus('0');
        sessionStorage.clear();
        console.log("APP COMPONENT");

        sessionStorage.removeItem('id_token');
        sessionStorage.removeItem('rfIuid');
        sessionStorage.removeItem('allUnreadMessageCount');
        this.router.navigate(['/splashcreen'], { queryParams: { tokenExpired: true } }).then(() => {
            console.log('logout token expired');
        });
    }
    public islogged() {
        const token = sessionStorage.getItem('id_token');
        if (token === undefined || token === null) {
            return false;
        }
        if (token && token !== undefined) {
            return !this.jwtHelper.isTokenExpired(token);
        } else {

        }
            return false;
    }


    get getloggedIn() {
        const isLogged =  this.authApplicatifService.loggedIn();
        const showProto = this.appConfig.getConfig('showprototype') === 1;
        return !isLogged && showProto;
      }
    public login() {
    // let token =
    // this.authenticationApplicatifService.login(username,"admin")
    }

    handleIdle() {
        this.zone.runOutsideAngular(() => {
        // sets an idle timeout of 600 seconds, for testing purposes.
        this.idle.setIdle(600);
        // sets a timeout period of 0 seconds. after 10 seconds of inactivity, the user will be considered timed out.
        // if timeout >0 timeout will be activate
        this.idle.setTimeout(0);
        });
        // sets the default interrupts, in this case, things like clicks, scrolls, touches to the document
        this.idle.setInterrupts(DEFAULT_INTERRUPTSOURCES);

        this.idle.onIdleEnd.subscribe(() => {
            this.idleState = 'No longer idle.';
            this.resetIdle();
        } );
        this.idle.onTimeout.subscribe(() => {
            this.zone.run(() => {
                this.idleState = 'Timed out!';
                if (this.isUserLogged) {
                    // this.authApplicatifService.updateConnectionStatus('0').subscribe(status => {
                    //     // console.log(status);
                    // });
                }
                this.timedOut = true;
            });
        });
        this.idle.onIdleStart.subscribe(() => {
            this.zone.run(() => {
                this.idleState = 'You \'ve gone idle!';
                if (this.isUserLogged) {
                    // this.authApplicatifService.updateConnectionStatus('0').subscribe(status => {
                    //     // console.log(status);
                    // });
                }
            });
        });
        this.idle.onTimeoutWarning.subscribe((countdown) => {
            this.zone.run(() => {
                this.idleState = 'You will time out in ' + countdown + ' seconds!';
            });
        });

        // sets the ping interval to 15 seconds
        /* this.keepalive.interval(15);

        this.keepalive.onPing.subscribe(() => {
          this.lastPing = new Date();
        }); */

        this.resetIdle();

        this.sharedService.getActivateIdle.subscribe(isIdleActive => {

            if (isIdleActive) {
                this.isUserLogged = true;
                this.resetIdle();
            } else {
                this.isUserLogged = false;
            }
        });
      }

      resetIdle() {
        this.zone.runOutsideAngular(() => {
        this.idle.watch();
        });
        this.zone.run(() => { // change
        this.idleState = 'Started.';
        this.timedOut = false;
        if (this.isUserLogged) {      
            // this.authApplicatifService.updateConnectionStatus('1').subscribe(status => {
            //     // console.log(status);
            // });
        }
        }); // change
      }
    @HostBinding('class') get themeClass() {
        return this.constantService.THEME_CLASS;
    }
}
