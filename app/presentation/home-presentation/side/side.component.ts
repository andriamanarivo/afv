import { User } from './../../../donnee/user/user';
import { Component, OnInit, Input, NgZone } from '@angular/core';
import { HomeApplicatifServiceACI } from '../../../service/applicatif/home';
import { HomeApplicatifService } from '../../../service/applicatif/home';
import { ActivatedRoute } from '@angular/router';
import { Utilisateur } from '../../../donnee/home/utilisateur';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { AppConfig } from '../../../contrainte/config/_app/app.config';
import { Router, CanActivate } from '@angular/router';
import { RouterLink } from '@angular/router';
import { PagerService } from '../../../service/pager.service';
import { TranslateService, LangChangeEvent } from 'ng2-translate';
import { SharedService } from '../../../commun/shared-service';
import { Message as MessagePrimeNg } from 'primeng/primeng';
import { MessageService } from 'primeng/components/common/messageservice';
import {AutorisationService} from '../../../commun/autorisation.service';

import { PhotoPdp } from '../../../commun/photo.pdp';
import { UtilsService } from 'app/commun/utils.service';
import { Observable } from 'rxjs/Observable';
import { environment } from 'environments/environment';
 
@Component({
    selector: 'app-side',
    templateUrl: './side.component.html',
    styleUrls: ['./side.component.css'],
    providers: [MessageService]
})
export class sideComponent implements OnInit {
    user: any;
    baseUrl = "";
    
    msgs: MessagePrimeNg[] = [];

    loadData = false;
    public userLeft? = [];
    public userConnecte?: any;
    public nbResult : boolean = false;
    totalItems: number;

    foods = [
        { value: '0', viewValue: 'Km' },
        { value: '1', viewValue: 'En ligne' },
        { value: '2', viewValue: 'A-Z' },
        { value: '3', viewValue: 'Age' },
        { value: '4', viewValue: 'S / D / SW' }
    ];
    selectedValue: string = this.foods[0].value;
    private allItems: any[];

    // pager object
    pager: any = {};
    sexeData = {M: 'Homme', F: 'Femme'};

    // paged items
    pagedItems: any[];
    identifiant: string;
    loading: boolean = false;
    public nbFavoris: number;
    public timer: any;
    public idUser: string;
    desc = false;
    order = null;
    public autorisation;
    constructor(public homeApplicatifServiceACI: HomeApplicatifServiceACI,
        private pagerService: PagerService,
        private router: Router,
        private photoPdp : PhotoPdp,
        public homeApplicatifService: HomeApplicatifService,
        private appConfig: AppConfig,
        public sharedService: SharedService,
        private translate: TranslateService,
        private messageService: MessageService,
        private utilsService: UtilsService,
        private zone: NgZone,
        private autorisationService: AutorisationService) {
        this.sharedService.favorisData.subscribe(data => {
            if (this.userLeft) {
                if (data.deleteFavoris) {
                    for (let i = 0; i < this.userLeft.length; i++) {
                        if (this.userLeft[i].id === data.user.id) {
                            this.userLeft[i].favoris = false;
                        }
                    }
                } else {
                    for (let i = 0; i < this.userLeft.length; i++) {
                        if (this.userLeft[i].id === data.user.id) {
                            this.userLeft[i].favoris = true;
                        }
                    }
                }
            }
        });
        this.baseUrl = this.appConfig.getConfig('baseUrlAppUrl');
        this.baseUrl = this.baseUrl.replace('app_dev.php/','');
        this.onUpdateFavoris();        
    }

    onUpdateFavoris(): void{
        this.sharedService.onupdatefavoris.subscribe(event=>{
            if(event){
                this.setPage(1, true);
                this.sharedService.onupdatefavoris.next(false);
            }
        });
    }

    sortList(field): void{
        this.desc = !this.desc;
        this.order = field;
        this.setPage(1);
    }

    ngOnInit() {
        this.autorisation=this.autorisationService.getAutorisation();
        this.setPage(1);
        this.sharedService.favoris$.subscribe(p => {
            this.nbFavoris = p;
        });
        this.sharedService.idUserConnete$.subscribe(p => {
            this.idUser = p;
        });
        this.sharedService.listeGauche$.subscribe(p => {
            this.userLeft = p;  
            this.utilsService.setConnectedUsers(this.userLeft);         
        });
        this.retrieveLeftListPeriodically();
    }
    
    retrieveLeftListPeriodically(): void {
        this.zone.runOutsideAngular(() => {          
            this.timer = Observable.interval(environment.getLeftListTimer).subscribe(() => {
                this.zone.run(() => {
                    this.setPage(1, true);
                });
            });
        });
    }

    setPage(page: number, hideLoader?:boolean) {
        if(!hideLoader) this.loadData = true;
        const offset = 10 * (page - 1);      
        let sortData = { desc: this.desc ? 1 : 0, order: this.order };
        this.homeApplicatifServiceACI.getUserByCity(offset, 10, sortData).subscribe(userLeft => {
            this.loadData = false;           
            this.totalItems = 0;
            this.nbResult = false;            
            this.sharedService.listeGauche = this.setPdp(userLeft);
            this.allItems = this.setPdp(userLeft);         
            if (page < 1 || page > this.pager.totalPages) {
                return;
            }
            this.pager = this.pagerService.getPager(this.totalItems, page, 10);          
            this.pagedItems = this.allItems.slice(this.pager.startIndex, this.pager.endIndex + 1);
        }, err => {
            this.loadData = false;
        });
    }

    setPdp(userLeft) {
        let userModified = [];
        if (userLeft.result) {
            if (userLeft.result.value) {
                userModified = userLeft.result.value.map(user => {
                    if (!user.photo) {
                        if (user.idVsEtes !== null) {
                            const profilePhoto = this.photoPdp.getPhotoPdp(user.idVsEtes);
                            if (profilePhoto) {
                                user.defaultpdp = profilePhoto.pdp;
                            } else {
                                user.defaultpdp = 'assets/img/profil-default.png';
                            }
                        } else {
                            user.defaultpdp = 'assets/img/profil-default.png';
                        }
                    }

                    return user;
                });
            }
            this.totalItems = userLeft.result.nbResults;
            if (userLeft.result.nbResults > 0) {
                this.nbResult = true;
            }
        }
        return userModified;
    }

    goToTchat(user): void {
        // Verifier si parmis les blacklist pour desactiver tchat
        this.homeApplicatifServiceACI.checkinBlackList(user.firstName)
            .subscribe(res => {
                if (res.isBlackList === 'true') {
                    this.errorCallback('Vous ne pouvez pas tchater avec cet utilisateur.  Il est dans votre liste noire, ou vous êtes dans la sienne.');
                } else {                   

                    this.router.navigate(['/home/profil/' + user.id + '/messages']);
                }
            }, err => {
                this.errorCallback(err);
            });
    }

    errorCallback(err): void {
        this.msgs = [];
        this.msgs.push({ severity: 'error', summary: '', detail: err });
    }    

    favoris(user: any) {
        this.user = user;
        if (this.autorisation['FAV_1']) {
            this.loading = true;
            this.identifiant = user.id;
            this.homeApplicatifServiceACI.addFavoris(user.id).subscribe((res) => {
                this.loading = false;
                if (res.status == 200) {
                    const offset = this.pager.currentPage - 1;
                    let sortData = { desc: this.desc ? 1 : 0, order: this.order };
                    this.homeApplicatifServiceACI.getUserByCity(offset, 10, sortData).subscribe(userLeft => {
                        if (userLeft.statut == 200) {
                            this.userLeft = this.setPdp(userLeft);
                            this.utilsService.setConnectedUsers(this.userLeft); 
                            this.totalItems = userLeft.nbResults;
                            this.allItems = this.setPdp(userLeft);
                            // Mise à jour favoris
                            this.sharedService.favoris = (this.nbFavoris) + 1;
                            this.homeApplicatifServiceACI.listeFavoris(this.idUser, 0, 10).subscribe(favoris => {
                                this.setFavoris(favoris.value);
                                this.sharedService.listeFavoris = favoris.value;
                                this.sharedService.favorisData.next({ deleteFavoris: false, user: user });
                            });
                        } else {
                            this.checkError(userLeft.status, user);
                        }
                        this.loading = false;
                    });
                } else {
                    this.loading = false;
                    this.checkError(res.status, user);
                }
            }, err => {
                this.loading = false;
                this.errorCallback(err);
            });
        } else {
            this.msgs = [];
            this.msgs.push({ severity: 'error', summary: '', detail: 'Vous n\'avez pas le droit d\'ajouter un favori' });
        }
    }

    checkError(status, user): void {
        switch (status) {
            case 400:
                this.errorCallback('Cet utilisateur a été suspendu.');
                user.favoris = false;
                break;
            case 500:
                this.errorCallback('Une erreur est survenue');
                user.favoris = false;
                break;
            default:
                break;
        }
    }

    setFavoris(fav) {
        for (var i in fav) {
            fav[i].favoris = true;
        }
    }
    deleteFavoris(user: any) {
        if (this.autorisation['FAV_2']) {
            this.loading = true;
            this.identifiant = user.id;
            this.homeApplicatifServiceACI.deleteFavoris(user.id).subscribe(() => {
                const offset = this.pager.currentPage - 1;
                let sortData = { desc: this.desc ? 1 : 0, order: this.order };
                this.homeApplicatifServiceACI.getUserByCity(offset, 10, sortData).subscribe(userLeft => {
                    if (userLeft.statut == 200) {
                        this.userLeft = this.setPdp(userLeft);
                        this.utilsService.setConnectedUsers(this.userLeft); 
                        this.totalItems = userLeft.nbResults;
                        this.allItems = this.setPdp(userLeft);;
                        // Mise à jour favoris
                        this.sharedService.favoris = (this.nbFavoris) - 1;
                        this.homeApplicatifServiceACI.listeFavoris(this.idUser, 0, 10).subscribe(favoris => {
                            this.setFavoris(favoris.value);
                            this.sharedService.listeFavoris = favoris.value;
                            this.sharedService.favorisData.next({ deleteFavoris: true, user: user });
                        });
                        this.loading = false;
                    } else {
                        this.loading = false;
                        this.checkError(userLeft.status, user);
                    }
                });
            }, err => {
                this.loading = false;
                this.errorCallback(err);
            });
        } else {
            this.msgs = [];
            this.msgs.push({ severity: 'error', summary: '', detail: 'Vous n\'aviez pas le droit de supprimer un Favori' });
        }
    }

    ngOnDestroy() {
        if (this.timer) {
            this.timer.unsubscribe();
        }
    }
}
