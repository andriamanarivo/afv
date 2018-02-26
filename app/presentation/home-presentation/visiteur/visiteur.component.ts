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
    selector: 'app-visiteur',
    templateUrl: './visiteur.component.html',
    styleUrls: ['./visiteur.component.css'],
    providers: [MessageService]
})
export class visiteurComponent implements OnInit {
    loadData: boolean = false;
    pager: any = {};
    tries: any[];
    loading: boolean = false;
    private allItems: any[];
    // paged items
    pagedItems: any[];
    visiteur: any[];
    public baseUrl: String;

    identifiant: string;
    totalItems: number;
    emptyMessage: string = "";
    public grilleMode: boolean = true;
    msgs: MessagePrimeNg[] = [];
    index: number;
    foods: any[];
    selectedValue: string;
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
    ) {
        this.sharedService.favorisData.subscribe(data => {
            if (data.deleteFavoris && this.visiteur) {
                for (var i = 0; i < this.visiteur.length; i++) {
                    if (this.visiteur[i].id === data.user.id) {
                        this.visiteur[i].favoris = false;
                    }
                }
            } else if (this.visiteur) {
                for (var i = 0; i < this.visiteur.length; i++) {
                    if (this.visiteur[i].id === data.user.id) {
                        this.visiteur[i].favoris = true;
                    }
                }
            }
        });       
    }
    
    ngOnInit() {
        let data = {};
        this.autorisation = this.autorisationService.getAutorisation();
        this.tries = this.tableauTrie(this.autorisation);
        this.selectedValue = this.tries[0].value;

        this.baseUrl = this.appConfig.getConfig("baseUrlAppUrl");
        this.baseUrl = this.baseUrl.replace("app_dev.php/", "");
        this.setPage(data, 1);
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

    sortVisiteur(): void {
        this.setPage({}, 1);
    }

    goToTchat(user): void {
        //Verifier si parmis les blacklist pour desactiver tchat      
        this.identifiant = user.id;
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


    errorCallback(err): void {
        this.msgs = [];
        this.msgs.push({ severity: 'error', summary: "", detail: err });
    }

    setPage(data, page: number) {
        let offset = 12 * (page - 1);
        this.loadData = true;
        this.homeApplicatifServiceACI.getVisiteur(data, offset, 12, this.selectedValue).subscribe(visiteur => {
            this.loadData = false;
            this.totalItems = visiteur.nbResults;
            let userModified = [];
            if (visiteur.value) {
                userModified = visiteur.value.map(user => {
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
            this.visiteur = userModified;
            this.utilsService.setConnectedUsers(this.visiteur);
            this.allItems = userModified;
            this.setEmptyMessage();
            if (visiteur.value) {
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
        this.emptyMessage = this.visiteur.length === 0 ? "Vous n'avez pas encore de visiteurs" : "";
    }


    gestionPermission(autorisation): any {
        let foods = [
            { value: '0', viewValue: 'Km' },
            { value: '1', viewValue: 'En ligne' },
            { value: '2', viewValue: 'A-Z' },
            { value: '4', viewValue: 'S / D / SW' }
        ];
        if (autorisation['RES_4']) {
            foods.push({ value: '3', viewValue: 'Age' });
        }
        return foods;
    }
}
