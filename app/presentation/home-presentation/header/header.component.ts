import {
    Component, OnInit, Input,
    ChangeDetectorRef, ViewChild, ElementRef,
    NgZone // changement
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router, CanActivate } from '@angular/router';
import { RouterLink } from '@angular/router';
import { TranslateService, LangChangeEvent } from 'ng2-translate';
import { tokenNotExpired, JwtHelper } from 'angular2-jwt';
import { SessionStorage, SessionStorageService } from 'ngx-webstorage';

import { HomeApplicatifServiceACI } from '../../../service/applicatif/home';
import { HomeApplicatifService } from '../../../service/applicatif/home';
import { Utilisateur } from '../../../donnee/home/utilisateur';
import { AppConfig } from '../../../contrainte/config/_app/app.config';
import { SharedService } from '../../../commun/shared-service';
import { SharedDataService } from '../../../presentation/shared/service/shared-data.service';
import { AuthenticationApplicatifService } from '../../../service/applicatif/authentication';
import { ChatMucService } from '../../../commun';
import { PhotoPdp } from '../../../commun/photo.pdp';
import { DataProfil } from 'app/donnee/home/dataProfil';
import { UtilsService } from 'app/commun/utils.service';
// import { CryptionAesService } from '../../../commun/cryption-aes.service';

import { LogoutService } from '../../../commun/logout-service';
import { Observable } from 'rxjs/Observable';
import { environment } from 'environments/environment';


declare const Strophe;
declare const $pres;
declare const $msg;

declare const RSM;
declare const $;
declare const $iq;

@Component({
    host: {
        '(document:click)': 'onClick($event)',
    },
    selector: 'app-admin-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.css']
})
export class headerComponent implements OnInit {

    innerHeight: number;
    /* @ViewChild('header') headerEl: ElementRef; */

    @ViewChild('headerRef') headerEl: ElementRef;

    public isloadTchat = false;

    public userConnecte?: any = {};
    public roleUserConnecte: boolean = false;
    public langue: any = [];
    public uselanguage: any;
    public useLangue: string;
    public nbFavoris = 0;

    public nbMessages = 0;
    public nbVisiteur = 0;
    currentUser: any;
    public mytimer;

    baseUrl: string;

    languageOptionOpen = false;
    showAction = false;
    uid: string;
    profilPercent = 0;

    foods = [
        { value: '0', viewValue: 'Km' },
        { value: '1', viewValue: 'En ligne' },
        { value: '2', viewValue: 'A-Z' },
        { value: '3', viewValue: 'Age' },
        { value: '4', viewValue: 'S / D / SW' }
    ];
    public timer: any;


    constructor(public homeApplicatifService: HomeApplicatifService,
        private jwtHelper: JwtHelper,
        public router: Router, private appConfig: AppConfig,
        private sharedDataService: SharedDataService,
        // private cryptionAesService: CryptionAesService,
        private photoPdp: PhotoPdp,
        private translate: TranslateService,
        private cdr: ChangeDetectorRef,
        private chatMucService: ChatMucService,
        private authApplicatifService: AuthenticationApplicatifService,
        public sharedService: SharedService,
        private homeApplicatifServiceACI: HomeApplicatifServiceACI,
        private logoutService: LogoutService,

        private zone: NgZone, // changement
        private utilsService: UtilsService
    ) {

        window.onresize = () => {
            this.sharedService.setHeaderHeight = this.headerEl.nativeElement.offsetHeight;
            this.cdr.detectChanges();
        };
        // Update pseudo after updating setting
        this.setCurrentUserPseudo();
    }
    getHash(): boolean {
        if (window.location.hash.indexOf('#/home/user') >= 0 || window.location.hash.indexOf('#/home/liste') >= 0) {
            return true;
        }
        return false;
    }

    isAlreadyLoaded() {
        this.sharedService.getTchatIsLoaded.subscribe(isloaded => {
            if (isloaded) {
                this.isloadTchat = true;
            }
        });
    }
    ngOnInit() {
        this.isloadTchat = false;
        this.sharedService.setHeaderHeight = this.headerEl.nativeElement.offsetHeight;
        const token = sessionStorage.getItem('id_token');
        this.currentUser = this.jwtHelper.decodeToken(token);
        if (this.currentUser.roles.indexOf('ADMINISTRATEUR') !== -1 ||
            this.currentUser.roles.indexOf('MODERATEUR') !== -1) {
            this.roleUserConnecte = true;
        }
        this.uid = this.currentUser.uid;
        this.getUserConnected();
        this.setLangue();
        this.setNbFavoris();
        this.getTchatMessageCount();
        this.getNbVisiteurAndFavoris();
        this.isAlreadyLoaded();
        this.isLogout();
        this.getAllConnectedUsers();
        this.retrieveAllConnectedUsersPeriodically();
        this.onDescriptionIsRejected();
    }

    //Apres connexion, ne pas attendre pingTchatTimer pour recuperer la liste
    getAllConnectedUsers(): void{
        this.homeApplicatifServiceACI.getAllConnectedUsers().subscribe(res => {
            this.sharedService.allConnectedUsers.next(res.session);
        }, err => {
            console.log(err);
        });
    }

    retrieveAllConnectedUsersPeriodically(): void {
        this.zone.runOutsideAngular(() => {
            this.timer = Observable.interval(environment.pingTchatTimer).subscribe(() => {
                this.zone.run(() => {
                    this.getAllConnectedUsers();
                });
            });
        });
    }

    getUserConnected(): void {
        this.sharedDataService.getUserConnected().subscribe(userConnecte => {
            this.completedProfilPercent();
            if (!userConnecte.photo) {
                if (userConnecte.idVsEtes !== null) {
                    const profilePhoto = this.photoPdp.getPhotoPdp(userConnecte.idVsEtes);
                    if (profilePhoto) {
                        userConnecte.defaultpdp = profilePhoto.pdp;
                    } else {
                        userConnecte.defaultpdp = 'assets/img/profil-default.png';
                    }
                } else {
                    userConnecte.defaultpdp = 'assets/img/profil-default.png';
                }
            }
            this.userConnecte = userConnecte;
            this.sharedService.idUserConnete = userConnecte.uid;
            this.baseUrl = this.appConfig.getConfig('baseUrlAppUrl');
            this.baseUrl = this.baseUrl.replace("app_dev.php/", "");
        });
    }

    onDescriptionIsRejected(): void{
        this.sharedService.onDescriptionIsRejected.subscribe(event=>{
            event && this.completedProfilPercent();           
        });
    }

    setNbFavoris(): void{
        this.sharedService.getNbFavoris().subscribe(p => {
            this.nbFavoris = p ? p : 0;
        });
    }

    setLangue(): void{
        this.langue = this.appConfig.getConfig('langue');
        const initLangue = {
            name: 'fr', value: 'fr', logo: 'assets/img/fr.png'
        };
        const currentLangue = this.langue.find(l => l.value === 'fr');
        this.uselanguage = currentLangue !== undefined ? currentLangue : initLangue;
        this.useLangue = 'fr';
    }

    getTchatMessageCount(): void {
        const isLogged = this.authApplicatifService.islogged();
        this.sharedService.getTchatMessageCount.subscribe(p => {
            if (isLogged) {
                if (p) {
                    this.nbMessages = p;
                    // console.log('nbMessages 1: ', this.nbMessages);
                } else {
                    const allUnreadMessageCount = sessionStorage.getItem('allUnreadMessageCount');
                    if (allUnreadMessageCount !== undefined && allUnreadMessageCount !== null) {
                        this.nbMessages = +allUnreadMessageCount;
                        // console.log('nbMessages 2 : ', this.nbMessages, ' allUnreadMessageCount : ', allUnreadMessageCount);
                    } else {
                        this.nbMessages = 0;
                    }
                }

                this.cdr.detectChanges();
            }
        });
    }

    getNbVisiteurAndFavoris(): void {
        this.homeApplicatifService.getNbVisiteurAndFavoris().subscribe(res => {
            this.sharedService.visiteur = res.visiteur;
            this.sharedService.setNbVisiteur(res.visiteur);
            this.sharedService.getNbVisiteur().subscribe(visiteur => {
                this.nbVisiteur = visiteur;
            });
            this.nbFavoris = res.favoris;
            if (!this.nbVisiteur || (this.nbVisiteur && this.nbVisiteur === 0)) {
                this.nbVisiteur = 0;
            }
            if (!this.nbFavoris || (this.nbFavoris && this.nbFavoris === 0)) {
                this.nbFavoris = 0;
            }
            this.sharedService.visiteur = res.visiteur;
            this.sharedService.favoris = res.favoris;
        }, err => {
            console.log(err);
        });
    }

    setCurrentUserPseudo(): void {
        this.sharedService.onUpdateSetting.subscribe(res => {
            this.userConnecte.pseudo = res;
        });
    }

    getNbVisiteur() {
        this.homeApplicatifService.getVisiteur({}, 0, 10, null).subscribe(visiteur => {
            this.nbVisiteur = visiteur.nbResults;
            if (!this.nbVisiteur || (this.nbVisiteur && this.nbVisiteur === 0)) {
                this.nbVisiteur = 0;
            }
            this.sharedService.visiteur = visiteur.nbResults;
        });
    }

    getNbFavoris() {
        const token = sessionStorage.getItem('id_token');
        this.currentUser = this.jwtHelper.decodeToken(token);
        this.homeApplicatifService.listeFavoris(this.currentUser.uid, 0, 10).subscribe(favoris => {
            if (favoris.value) {
                this.nbFavoris = favoris.nbResults;
                this.sharedService.favoris = favoris.nbResults;
            } else {
                this.nbFavoris = 0;
            }
        });
    }

    goToHome(): void {
        this.router.navigate(['/home/user']);
    }

    isLogout() {
        /* this.sharedService.getLogout.subscribe(isLogout => {
            if (isLogout) {
                alert('splashcreen');
                this.router.navigate(['/splashcreen']).then(() => {
                    alert('reload');
                    location.reload();
                    this.sharedService.setLogout = false;
                    this.sharedService.setChatDisconnection(false);
                    console.log('reload et relocation header');
                });
            }
        }); */
    }

    public logout() {
        this.logoutService.logout();
        setTimeout(() => this.router.navigate(['/splashcreen']).then(() => {
            location.reload();
            this.sharedService.setLogout = false;
            this.sharedService.setChatDisconnection(false);
            console.log('reload et relocation header');
        }), 100);
    }

    popLanguage(event: any) {
        event.stopPropagation();
        this.languageOptionOpen = !this.languageOptionOpen;

        return false;
    }

    //
    public onSelectLangue(language) {
        this.languageOptionOpen = !this.languageOptionOpen;
        this.uselanguage = language;
        this.translate.use(this.uselanguage.value);
        if (this.router.url.endsWith('/messages')) {
            this.sharedService.setLanguageIsChanged({ isChanged: true, language: this.uselanguage.value });
        }
        // this.translate.use(this.useLangue);
    }

    /* public changeLangue(event) {
        this.uselanguage = event;
        this.translate.use(this.uselanguage.value);
    } */

    public popupAction() {
        this.showAction = !this.showAction;
    }

    onClick(event): void {
        var target = event.target || event.srcElement;
        if (target.id !== 'linkProfil' && target.id !== 'pseudoLabel' && target.id !== 'ageLabel') {
            this.showAction = false;
        }
    }

    goToProfil(): void {
        this.router.navigate(['/home/modifProfil', 0]);
    }

    refreshCountData(messageCount) {
        console.clear();
        console.log('unread message : ', messageCount);
    }

    /* getIfUserActive() {
         this.homeApplicatifServiceACI.getUserDetail(this.uid).subscribe(userDetail => {
                 if (userDetail.statutCompte === 1) {
                     // Protractor
                     if (this.currentUser.username.toLocaleLowerCase().indexOf('robot') === 0) {
                         this.zone.runOutsideAngular(() => {  // changement
                             clearInterval(this.mytimer);
                         });
                     } else {
                         clearInterval(this.mytimer);
                     }
                     // changement
                     this.logout();
                 }

                 if (userDetail.status === 400) {
                     console.log('passer 2');
                     if (userDetail.error.indexOf('USER_SUSPEND') !== -1) {
                         if (this.currentUser.username.toLocaleLowerCase().indexOf('robot') === 0) {
                             this.zone.runOutsideAngular(() => {  // changement
                                 clearInterval(this.mytimer);
                             });                                  // changement
                         } else {
                             clearInterval(this.mytimer);
                         }

                         this.logout();
                     }
                 }

         });
     }*/

    completedProfilPercent() {
        this.homeApplicatifServiceACI.getUserDetail(this.uid).subscribe(userConnect => {            
            this.profilPercent = this.utilsService.completedProfilPercent(userConnect);
        });
    }

    ngOnDestroy() {
        if (this.timer) {
            this.timer.unsubscribe();
        }
    }


}
