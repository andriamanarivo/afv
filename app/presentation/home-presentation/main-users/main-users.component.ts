import { Component, OnInit, AfterViewInit, ViewChild, Input, Output, EventEmitter } from '@angular/core';
import { HomeApplicatifServiceACI } from '../../../service/applicatif/home';
import { Home } from '../../../donnee/home/home';
import { Router, CanActivate, ActivatedRoute } from '@angular/router';
import { PagerService } from '../../../service/pager.service';
import { SharedService } from '../../../commun/shared-service';
import { AppConfig } from '../../../contrainte/config/_app/app.config';
import { SharedDataService } from '../../../presentation/shared/service/shared-data.service';
import { Message as MessagePrimeNg } from 'primeng/primeng';
import { MessageService } from 'primeng/components/common/messageservice';
import { tokenNotExpired, JwtHelper } from 'angular2-jwt';
import { PhotoProfilModalComponent } from '../photo-profil-modal/photo-profil-modal.component';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';


import { PhotoPdp } from '../../../commun/photo.pdp';
import { UtilsService } from 'app/commun/utils.service';


@Component({
    selector: 'app-main-users',
    templateUrl: './main-users.component.html',
    styleUrls: ['./main-users.component.css'],
    providers: [MessageService]
})
export class MainUsersComponent implements OnInit {
    accept: boolean;
    @Input() set dataSend(data: any) {
        if (data && !data.isInitSearch) {
            this.onUpdate(data, data.order);
        }
    };
    @Input() modeList = false;
    @ViewChild('content') content: any;
    @Output() onDefaultSearchParamsLoad = new EventEmitter();
    bufferValue = 75;
    color = 'primary';
    desc = 0;
    identifiant: string;
    loadList = false;
    msgs: MessagePrimeNg[] = [];
    nbFavoris = 0;
    p = 1;
    pagedItems: any[];
    pager: any = {};
    private allItems: any[];
    public baseUrl: String;
    public data: any = {};
    public dataFiltre: any = {};
    public emptyMessage: String = '';
    public homes?: any;
    public isFiltre = false;
    public order: string = null;
    public progresValue = 50;
    public recherche: any = {};
    public recherches: any = [];
    public show = false;
    public showContents = false;
    public testShare: string;
    size = 4;
    totalItems: number;
    foods = [
        { value: '0', viewValue: 'Km' },
        { value: '1', viewValue: 'En ligne' },
        { value: '2', viewValue: 'A-Z' },
        { value: '3', viewValue: 'Age' },
        { value: '4', viewValue: 'S / D / SW' }
    ];
    selectedValue: string = this.foods[0].value;

    constructor(
        public homeApplicatifServiceACI: HomeApplicatifServiceACI,
        private pagerService: PagerService,
        private jwtHelper: JwtHelper,
        private photoPdp: PhotoPdp,
        public sharedDataService: SharedDataService,
        private messageService: MessageService,
        public sharedService: SharedService,
        private appConfig: AppConfig,
        private router: Router,
        private bsModalRef: BsModalRef,
        private modalService: BsModalService,
        private route: Router,
        private utilsService: UtilsService
    ) {
        this.sharedService.favorisData.subscribe(data => {
            if (data.deleteFavoris && this.homes) {
                for (let i = 0; i < this.homes.length; i++) {
                    if (this.homes[i].id === data.user.id) {
                        this.homes[i].favoris = false;
                    }
                }
            } else if (this.homes) {
                for (let i = 0; i < this.homes.length; i++) {
                    if (this.homes[i].id === data.user.id) {
                        this.homes[i].favoris = true;
                    }
                }
            }
        });

        const confirmCookie =  localStorage.getItem('confirmCookie');
        this.show = !(confirmCookie && confirmCookie === '1');
        this.sharedService.showAddPhotoProfilModal.subscribe(isFirstConnexion => {
            console.log('showAddPhotoProfilModal ', isFirstConnexion);
            if (isFirstConnexion) {
                this.showAddPhotoProfilModal();
            }
        });
    }

    acceptCookies(): void {
        /* this.sharedService.confirmCookie.next(false); */
        localStorage.setItem('confirmCookie', '1');
        this.show = false;
    }

    ngOnInit() {
        this.testShare = this.sharedDataService.test;
        this.baseUrl = this.appConfig.getConfig('baseUrlAppUrl');
        this.baseUrl = this.baseUrl.replace('app_dev.php/', '');
        this.data = {
            'uidSearch': '',
            'ageMax': null,
            'ageMin': null,
            'rencontre': '',
            'localisation': '',
            'tendances': '',
            'pratiques': ['', '', ''],
            'isConnected': null,
            'isDefault': null,
            'avecPhoto': null,
            'libelle': ''
        };
        this.initRecherche();
    }
    errorCallback(err): void {
        this.msgs = [];
        this.msgs.push({ severity: 'error', summary: '', detail: err });
    }

    showAddPhotoProfilModal(): void {
        this.bsModalRef = this.modalService.show(PhotoProfilModalComponent);
        this.sharedService.showAddPhotoProfilModal.next(false);
    }

    getEmptyMessage() {
        return this.homes && this.homes.length === 0 ? 'Aucun résultat trouvé pour cette recherche' : '';
    }

    public initRecherche() {
        this.dataFiltre = this.data;
        this.homeApplicatifServiceACI.getListRecherche().subscribe(res => {
            this.onDefaultSearchParamsLoad.next(res);
            this.recherches = res;
            this.data.postRequest = false;
            res.forEach((data) => {
                if (data && data.isDefault) {
                    this.recherche = data;
                    this.data = data;
                    this.data.postRequest = true;
                    this.isFiltre = true;
                    this.dataFiltre = data;
                    this.setPage(1, this.data);
                }
            });

            if (!this.isFiltre) {
                this.setPage(1, this.data);
            }
        });
    }

    public onUpdate(data, order) {
        this.order = order;
        this.data = data;
        this.order = order;
        this.pager = {};
        this.setPage(1, this.data);
        this.dataFiltre = this.clone(this.data);

    }

    setPage(page: number, data) {
        this.loadList = true;
        const offset = 12 * (page - 1);
        const sortData = { order: this.order, desc: this.desc };
        this.homeApplicatifServiceACI.recherche(data, offset, 12, sortData).subscribe((homes) => {
            this.loadList = false;
            let homesModified = [];
            const data = homes.result;
            if (!homes.errorExist) {
                homesModified = data.value.map(user => {
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
            this.homes = homesModified;
            this.utilsService.setConnectedUsers(this.homes);
            if (data.nbResults) {
                this.totalItems = data.nbResults;
                this.allItems = data.value;
            } else {
                this.totalItems = 0;
                this.allItems = [];
            }
            if (page < 1 || page > this.pager.totalPages) {
                return;
            }
            this.pager = this.pagerService.getPager(this.totalItems, page, 12);
            this.pagedItems = this.allItems.slice(this.pager.startIndex, this.pager.endIndex + 1);
        }, err => {
            this.loadList = false;
        });
    }

    public clone(obj) {
        try {
            var copy = JSON.parse(JSON.stringify(obj));
        } catch (ex) {
            alert('erreur');
        }
        return copy;
    }

    hideSidebar(): void {
        if (!this.accept) {
            this.show = true;
        }
    }

    goToAbout(): void {
        this.route.navigate(['/confidentiality']);
    }

}
