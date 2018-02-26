import { Component, OnInit } from '@angular/core';
import { PagerService } from '../../../service/pager.service';
import { HomeApplicatifServiceACI } from '../../../service/applicatif/home';
import { SharedService } from '../../../commun/shared-service';
import { AppConfig } from '../../../contrainte/config/_app/app.config';
import { Message as MessagePrimeNg } from 'primeng/primeng';
import { MessageService } from 'primeng/components/common/messageservice';
import { Router, CanActivate } from '@angular/router';
import { AutorisationService } from '../../../commun/autorisation.service';
import { PhotoPdp } from '../../../commun/photo.pdp';
import { UtilsService } from 'app/commun/utils.service';


@Component({
    selector: 'app-favoris',
    templateUrl: './favoris.component.html',
    styleUrls: ['./favoris.component.css'],
    providers: [MessageService]
})
export class FavorisComponent implements OnInit {
    loadData: boolean = false;
    pager: any = {};
    msgs: MessagePrimeNg[] = [];
    public baseUrl: String;
    loading: boolean = false;
    loadingTchat: boolean = false;
    private allItems: any[];    
    pagedItems: any[];
    favoris: any[];
    nbFavoris: number = 0;
    identifiant: string;
    emptyMessage: string = "";
    totalItems: number;
    public grilleMode: boolean = true;
    index: number;  
    tries: any[];
    selectedValue: string;
    sortOrder: number = 0;
    uid: string;
    public autorisation;

    constructor(public homeApplicatifServiceACI: HomeApplicatifServiceACI,
        private pagerService: PagerService,
        public sharedService: SharedService,
        private appConfig: AppConfig,
        private photoPdp: PhotoPdp,
        private messageService: MessageService,
        private router: Router,
        private autorisationService: AutorisationService,
        private utilsService: UtilsService
    ) { }
   
    ngOnInit() {
        this.autorisation = this.autorisationService.getAutorisation();
        this.tries = this.tableauTrie(this.autorisation);
        this.selectedValue = this.tries[0].value;
        this.baseUrl = this.appConfig.getConfig("baseUrlAppUrl");
        this.baseUrl = this.baseUrl.replace("app_dev.php/", "");
        this.homeApplicatifServiceACI.getUserConnecte().subscribe(userDetail => {
            this.uid = userDetail.uid;
            this.setPage(1);            
            this.sharedService.listeFavoris$.subscribe(p => {
                this.favoris = p;
                this.utilsService.setConnectedUsers(this.favoris);
            });
        });       
    }
   
    sortFavoris(): void {
        this.setPage(1);
    }

    errorCallback(err): void {
        this.loadingTchat = false;
        this.msgs = [];
        this.msgs.push({ severity: 'error', summary: "", detail: err });
        this.setEmptyMessage();
    }

    getProfilePhoto(idVsEtes) {
        const profilePhoto = this.photoPdp.getPhotoPdp(idVsEtes);

        return profilePhoto ? profilePhoto.pdp : 'assets/img/profil-default.png';
    }
    setPage(page: number) {
        this.loadData = true;
        let offset = 12 * (page - 1);
        let sortData = { order: this.selectedValue, desc: this.sortOrder };
        this.homeApplicatifServiceACI.listeFavoris(this.uid, offset, 12, sortData).subscribe(favoris => {
            this.loadData = false;
            let userModified = [];
            if (favoris.value) {
                userModified = favoris.value.map(user => {
                    user.defaultpdp = !user.photo && user.idVsEtes !== null ?
                    this.getProfilePhoto(user.idVsEtes) : 'assets/img/profil-default.png';
                    /* if (!user.photo) {
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
                    } */
                    return user;
                });
            }
            this.totalItems = favoris.nbResults;
            this.sharedService.favoris = favoris.nbResults;
            this.sharedService.listeFavoris = favoris.value;
            this.allItems = favoris.value;
            this.nbFavoris = favoris.value.length;
            this.setEmptyMessage();
            if (favoris.value) {
                if (page < 1 || page > this.pager.totalPages) {
                    return;
                }
                this.pager = this.pagerService.getPager(this.totalItems, page, 12);
                this.pagedItems = this.allItems.slice(this.pager.startIndex, this.pager.endIndex + 1);
            }
        }, err => {
            this.loadData = false;
        });
    }

    setEmptyMessage(): void {
        this.emptyMessage = this.totalItems === 0 ? "Vous n'avez pas encore de favoris" : "";
    }

    onRemoveFavoris(user) {
        if (user) {
            this.setPage(1);
            this.setEmptyMessage();
        }
    }

    setFavoris(fav) {
        for (var i in fav) {
            fav[i].favoris = true;
        }
    }

    goToTchat(user): void {
        this.homeApplicatifServiceACI.checkinBlackList(user.firstName)
            .subscribe(res => {
                if (res.isBlackList === true || res.isUserAddBlackList) {                    
                    let errorMessage = res.isUserAddBlackList ? "Vous ne pouvez plus tchater avec cet utilisateur. Il vous a mis dans sa liste noire." : "Vous ne pouvez plus tchater avec cet utilisateur. Il est dans votre liste noire. Gérer votre liste noire dans votre profil/options.";
                    this.errorCallback(errorMessage);
                } else {
                    this.router.navigate(['/home/profil/' + user.id + '/messages']);
                }
            }, err => {
                this.errorCallback(err);
            });
    }

    deleteFavoris(user: any) {
        this.loading = true;
        this.identifiant = user.id;
        this.homeApplicatifServiceACI.deleteFavoris(user.id).subscribe(res => {
            setTimeout(() => {
                user.favoris = false;
                this.loading = false;
                this.nbFavoris = (this.nbFavoris - 1);
                this.sharedService.setNbFavoris(this.nbFavoris);
                this.onRemoveFavoris(user)
            });
        }, err => {
            this.errorCallback(err);
        });
    }

    tableauTrie(autorisation): any {
        let tries = [];

        if (autorisation['RES_4']) {
            tries.push({ value: 'age', viewValue: 'age' });
        }
        if (autorisation['RES_3']) {
            tries.push({ value: 'firstName', viewValue: 'ordre alphabétique' });
        }
        if (autorisation['RES_6']) {
            tries.push({ value: 'dist', viewValue: 'distance' });
        }

        if (autorisation['RES_5']) {
            tries.push({ value: 'tendance', viewValue: 'tendance' });
        }

        if (tries.length === 0) {
            tries.push({ value: '', viewValue: 'aucun' });
        }


        return tries;
    }

}
