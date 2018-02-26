import { Component, OnInit } from '@angular/core';
import { tokenNotExpired, JwtHelper } from 'angular2-jwt';
import { HomeApplicatifServiceACI } from '../../../service/applicatif/home/home.applicatif.service.aci';
import { PagerService } from '../../../service/pager.service';
import { Router } from '@angular/router';
import { AppConfig } from '../../../contrainte/config/_app/app.config';
import { Message as MessagePrimeNg } from 'primeng/primeng';
import { MessageService } from 'primeng/components/common/messageservice';
import { PhotoPdp } from '../../../commun/photo.pdp';
import { SharedService } from 'app/commun';
import { UtilsService } from 'app/commun/utils.service';

@Component({
    selector: 'app-blacklist',
    templateUrl: './blacklist.component.html',
    styleUrls: ['./blacklist.component.css'],
    providers: [MessageService]
})
export class BlacklistComponent implements OnInit {
    currentUser: any;
    msgs: MessagePrimeNg[] = [];
    blacklist = [];
    error = '';
    pagedItems: any[];
    nbResults: number = 0;
    pager: any = {};
    private allItems: any[];
    baseUrl: string = '';
    totalItems: number;
    loading: boolean = false;
    constructor(
        private messageService: MessageService,
        private appConfig: AppConfig,
        private router: Router,
        public sharedService: SharedService,
        private homeService: HomeApplicatifServiceACI,
        private jwtHelper: JwtHelper,
        private pagerService: PagerService,
        private photoPdp: PhotoPdp,
        private utilsService: UtilsService
     ) {
        const token = sessionStorage.getItem('id_token');
        this.currentUser = this.jwtHelper.decodeToken(token);        
    }
    ngOnInit() {
        this.baseUrl = this.appConfig.getConfig('baseUrlAppUrl');
        this.baseUrl = this.baseUrl.replace("app_dev.php/",""); 
        this.setPage(1);
    }
    goToProfile(id: string): void {
        const link = ['/home/profil', id];
        this.router.navigate(link);
    }
    back(): void {
        this.router.navigate(['/home/modifProfil/1']);

    }
    errorCallback(err): void {
        this.msgs = [];
        this.msgs.push({ severity: 'error', summary: '', detail: err });
    }
   
    setPage(page: number) {
        // let offset = 10 * (page - 1) + 1;
        const offset = 12 * (page - 1);
        this.homeService.blacklist(this.currentUser.username, offset, 12).subscribe(blacklist => {
            this.totalItems = 0;
            let blacklistModified = [];
            if (blacklist.value) {
                this.totalItems = blacklist.nbResults;
                blacklistModified = blacklist.value.map(black => {
                    if (!black.photo) {
                        if (black.idVsEtes !== null) {
                            const profilePhoto = this.photoPdp.getPhotoPdp(black.idVsEtes);
                            if (profilePhoto) {
                                black.defaultpdp = profilePhoto.pdp;
                            } else {
                                black.defaultpdp = 'assets/img/profil-default.png';
                            }
                        } else {
                            black.defaultpdp = 'assets/img/profil-default.png';
                        }
                    }
                    return black;
                });
            }
            this.blacklist = blacklistModified;
            this.utilsService.setConnectedUsers(this.blacklist);
            this.allItems = blacklistModified;
            if (blacklistModified) {
                if (page < 1 || page > this.pager.totalPages) {
                    return;
                }
                this.pager = this.pagerService.getPager(this.totalItems, page, 12);
                this.pagedItems = this.allItems.slice(this.pager.startIndex, this.pager.endIndex + 1);
            }

        }, err => {
            this.errorCallback(err);
            this.error = err;
        });
    }

}
