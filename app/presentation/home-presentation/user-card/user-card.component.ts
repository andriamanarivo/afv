import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Router, CanActivate } from '@angular/router';
import { HomeApplicatifServiceACI } from '../../../service/applicatif/home';
import { SharedService } from '../../../commun/shared-service';
import { Message as MessagePrimeNg } from 'primeng/primeng';
import { MessageService } from 'primeng/components/common/messageservice';
import { AppConfig } from '../../../contrainte/config/_app/app.config';
import { AutorisationService } from '../../../commun/autorisation.service';

@Component({
    selector: 'app-user-card',
    templateUrl: './user-card.component.html',
    styleUrls: ['./user-card.component.css'],
    providers: [MessageService]
})
export class UserCardComponent implements OnInit {
    @Input() user: any = {};
    @Input() nbFavoris: number;
    @Input() showTchatAndFavoris = true;
    @Output() onRemoveFavoris = new EventEmitter();
    loading = false;
    @Input() modeList = false;
    identifiant = '';
    baseUrl = '';
    msgs: MessagePrimeNg[] = [];
    public autorisation ;

    constructor(private appConfig: AppConfig,
        private router: Router,
        private homeApplicatifServiceACI: HomeApplicatifServiceACI,
        private sharedService: SharedService,
        private messageService: MessageService,
        private autorisationService: AutorisationService) {
        this.sharedService.getNbFavoris().subscribe(nb => {
            this.nbFavoris = nb;
        });
    }

    goToTchat(user): void {
        this.homeApplicatifServiceACI.checkinBlackList(user.firstName)
            .subscribe(res => {
                if (res.isBlackList === true || res.isUserAddBlackList) {
                    // tslint:disable-next-line:max-line-length
                    const errorMessage = res.isUserAddBlackList ? 'Vous ne pouvez plus tchater avec cet utilisateur. Il vous a mis dans sa liste noire.' : 'Vous ne pouvez plus tchater avec cet utilisateur. Il est dans votre liste noire. Gérer votre liste noire dans votre profil/options.';
                    this.errorCallback(errorMessage);
                } else {
                    this.router.navigate(['/home/profil/' + user.id + '/messages']);
                }
            }, err => {
                this.errorCallback(err);
            });
    }

    favoris(user: any) {
        if (this.autorisation['FAV_1']) {
            this.loading = true;
            this.identifiant = user.id;
            this.homeApplicatifServiceACI.addFavoris(user.id).subscribe(res => {
                this.loading = false;
                this.identifiant = '';
                if (res.error) {
                    this.checkError(res.status, user);
                } else {
                    this.sharedService.onupdatefavoris.next(true);                    
                    user.favoris = true;
                    this.nbFavoris = (this.nbFavoris + 1);
                    this.sharedService.setNbFavoris(this.nbFavoris);
                    this.sharedService.favorisData.next({ deleteFavoris: false, user: user });
                }
            }, err => {
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

    deleteFavoris(user: any) {
        if (this.autorisation['FAV_2']) {
            this.loading = true;
            this.identifiant = user.id;
            this.homeApplicatifServiceACI.deleteFavoris(user.id).subscribe(res => {
                user.favoris = false;
                this.nbFavoris = (this.nbFavoris - 1);
                this.sharedService.setNbFavoris(this.nbFavoris);
                this.onRemoveFavoris.emit(user);
                this.sharedService.favorisData.next({ deleteFavoris: true, user: user });
                this.identifiant = '';
                this.loading = false;
                this.sharedService.onupdatefavoris.next(true); 
            }, err => {
                this.errorCallback(err);
            });
        } else {
            this.msgs = [];
            this.msgs.push({ severity: 'error', summary: '', detail: 'Vous n\'avez pas le droit de supprimer un favori' });
        }
    }

    goToProfil(id): void {
        const link = ['/home/profil', id];
        this.router.navigate(link);
    }

    errorCallback(err): void {
        this.identifiant = '';
        this.loading = false;
        this.msgs = [];
        this.msgs.push({ severity: 'error', summary: '', detail: err });
    }

    ngOnInit() {
        this.autorisation = this.autorisationService.getAutorisation();
        this.baseUrl = this.appConfig.getConfig('baseUrlAppUrl');
        this.baseUrl = this.baseUrl.replace('app_dev.php/', '');
    }

}
