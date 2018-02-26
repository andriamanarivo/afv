import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Home } from './../../donnee/home/home';
import { TranslateService, LangChangeEvent } from 'ng2-translate';

import { HomeApplicatifServiceACI } from '../../service/applicatif/home';
import { HomeApplicatifService } from '../../service/applicatif/home';

import { PagerService } from '../../service/pager.service';
import { SharedDataService } from '../../presentation/shared/service/shared-data.service';
import { AutorisationService } from '../../commun/autorisation.service';
import { SessionStorage, SessionStorageService } from 'ngx-webstorage';
import { AuthenticationApplicatifService } from '../../service/applicatif/authentication';


import {
    AuthenticationApplicatifServiceACI
} from '../../service/applicatif/authentication';

@Component({
    selector: 'app-home-presentation',
    templateUrl: './home-presentation.component.html',
    styleUrls: ['./home-presentation.component.css']
})
export class HomePresentationComponent implements OnInit {
    //public userLeft : Home[];
    //corrige le build prod

    public userLeft?: any;
    public userConnecte?: any;
    totalItems: number;

    foods = [
        {value: '0', viewValue: 'Km'},
        {value: '1', viewValue: 'En ligne'},
        {value: '2', viewValue: 'A-Z'},
        {value: '3', viewValue: 'Age'},
        {value: '4', viewValue: 'S / D / SW'}
    ];
    selectedValue: string = this.foods[0].value;

    constructor(public homeApplicatifServiceACI: HomeApplicatifServiceACI,
                private pagerService: PagerService,
                private sharedDataService : SharedDataService,
                private router: Router,
                public homeApplicatifService: HomeApplicatifService,
                private authApplicatifService: AuthenticationApplicatifService,
                private translate: TranslateService,
                private autorisationService: AutorisationService
        ) {
            // translate desactivé temporairerement
            /* if (this.translate.currentLang === undefined) {
                translate.setDefaultLang('fr');
                // the lang to use, if the lang isn't available, it will use the current loader to get them
                translate.use('fr');
            } */

            translate.setDefaultLang('fr');
            translate.use('fr');
    }

    private allItems: any[];

    // pager object
    pager: any = {};

    // paged items
    pagedItems: any[];
    public href: string = '';
    public rout = this.router;
    public autorisation;
    ngOnInit() {
        this.autorisation = this.autorisationService.getAutorisation();
        this.href = this.router.url;
        this.homeApplicatifService.getUserConnecte().subscribe(userConnecte => {
            // TODO
            const vsEtes = userConnecte.value.find(etape => etape.etape === 'etape1');
            if (vsEtes) {
                // console.log('vous etes : ', vsEtes.value);
                const vsEte = vsEtes.value.find(etape => etape.checked);
                if (vsEte) {
                    userConnecte.idVsEtes = vsEte.id;
                }

            }

            this.userConnecte = userConnecte;
            this.sharedDataService.setUserConnected(userConnecte);
        });
        this.setPage(1);

    }

    setPage(page: number) {
        // let offset = 10 * (page - 1) + 1;
        let offset = 10 * (page - 1) ;  
        // this.homeApplicatifServiceACI.getUserByCity(offset, 10).subscribe(userLeft => {
        //     this.userLeft = userLeft.value;
        //     this.totalItems = userLeft.nbResults;
        //     this.allItems = userLeft.value;
        //     //pagination
        //     if (page < 1 || page > this.pager.totalPages) {
        //         return;
        //     }
        //     this.pager = this.pagerService.getPager(this.totalItems, page, 10);

        //     // get current page of items
        //     this.pagedItems = this.allItems.slice(this.pager.startIndex, this.pager.endIndex + 1);

        //     //fin pagination
        // });


    }

    public logout() {
        sessionStorage.clear();
        sessionStorage.removeItem('id_token');
        sessionStorage.removeItem('rfIuid');
        sessionStorage.removeItem('allUnreadMessageCount');
        this.authApplicatifService.updateConnectionStatus('0').subscribe(status => {
            console.log(status);
          });
        this.router.navigate(['/splashcreen']).then(() => {
            console.log('home');
        });
    }




}
