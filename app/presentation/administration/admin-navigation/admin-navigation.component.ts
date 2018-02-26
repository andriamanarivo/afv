import { Component, OnInit } from '@angular/core';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { SharedService } from '../../../commun/shared-service';
import { tokenNotExpired, JwtHelper } from 'angular2-jwt';
import { AdministrationApplicatifServiceACI } from 'app/service/applicatif/administration';

@Component({
    selector: 'app-admin-navigation',
    templateUrl: './admin-navigation.component.html',
    styleUrls: ['./admin-navigation.component.scss'],
    animations: [
        trigger('toggleHeight', [
            state('inactive', style({
                height: '0',
                opacity: '0'
            })),
            state('active', style({
                height: '*',
                opacity: '1'
            })),
            transition('inactive => active', animate('200ms ease-in')),
            transition('active => inactive', animate('200ms ease-out'))
        ])
    ]
})
export class AdminNavigationComponent implements OnInit {

    // , max:this.max, first:this.first
    currentUser: any;
    isAdmin: boolean;
    isAllowed: boolean;
    navigationSubState: any;
    sidebarVisible: boolean;
    query:string='';
    already:string='';
    afile:string='';
    max:number;
    first : number;

    constructor(
        private jwtHelper: JwtHelper,
        private sharedService: SharedService,
        private adminService: AdministrationApplicatifServiceACI
    ) { }

   

    ngOnInit() {
        this.initializeAsideComponent();
        const token = sessionStorage.getItem('id_token');
        this.isAllowed = false;
        this.isAdmin = false;
        this.currentUser = this.jwtHelper.decodeToken(token);
        if (this.currentUser.roles.indexOf('ADMINISTRATEUR') !== -1) {
            this.isAdmin = true;
        }
        if (this.currentUser.roles.indexOf('ADMINISTRATEUR') !== -1 ||
            this.currentUser.roles.indexOf('MODERATEUR') !== -1) {
            this.isAllowed = true;
        }
    }

    initializeAsideComponent() {
        this.navigationSubState = {
            Administrations: 'active',
            multi: 'inactive'/*,
        Tables: 'inactive'*/
        };
    }

    // Toggle sub menu
    toggleNavigationSub(menu, event) {
        event.preventDefault();
        this.navigationSubState[menu] = (this.navigationSubState[menu] === 'inactive' ? 'active' : 'inactive');
    }

    initPagination(): void {
        this.sharedService.setAbusPage(1);
    }

}
