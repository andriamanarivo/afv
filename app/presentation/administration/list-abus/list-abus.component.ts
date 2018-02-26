import { Component, OnInit, EventEmitter } from '@angular/core';
import { AdministrationApplicatifServiceACI } from "../../../service/applicatif/administration/administration.applicatif.service.aci";
import { SharedService } from '../../../commun/shared-service';
import { Router } from "@angular/router";
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { DatePickerComponent } from 'ngx-bootstrap';
import { MessageService } from 'primeng/components/common/messageservice';
import { Message as MessagePrimeNg } from 'primeng/primeng';
import { LogoutService } from 'app/commun/logout-service';

@Component({
    selector: 'app-list-abus',
    templateUrl: './list-abus.component.html',
    styleUrls: ['./list-abus.component.css'],
    providers: [MessageService]
})
export class ListAbusComponent implements OnInit {
    abusForm: FormGroup;
    date_deb: Date;
    date_fin: Date;
    emetter: string;
    filtre: any;
    itemsPerPage: number = 20;
    length: number = 0;
    listAbus = [];
    loading: boolean = false;
    maxSize: number = 5;
    msgs: MessagePrimeNg[] = [];
    numPages: number = 1;
    page: number = 1;
    rows: Array<any> = [];
    showDetailEvent = new EventEmitter();
    user_report: string;
    config: any = {
        paging: true,
        className: ['table-striped', 'table-bordered']
    };
    columns: Array<any> = [
        { title: 'Statut', name: 'statut', sort: false },
        { title: 'Date', name: 'dateCreation', sort: false },
        { title: 'Emetteur', name: 'pseudoEm', sort: false },
        { title: 'Utilisateur reporté', name: 'pseudoRep', sort: false },
        { title: 'Motif', name: 'motif', sort: false },
        { title: "Nombre de reports d'abus", name: 'nb', sort: false },
        { title: 'Prévenir', name: 'btnPrevenir', sort: false },
        { title: 'Suspendre', name: 'btnSuspendre', sort: false },
        { title: 'Aucune action', name: 'btnNothing', sort: false },
    ];
    statuts = [
        { id: '', libelle: 'Aucun' },
        { id: '1', libelle: 'En entente' },
        { id: '2', libelle: 'En cours' },
        { id: '3', libelle: 'Traité' }
    ]
    constructor(private adminService: AdministrationApplicatifServiceACI,
        private sharedService: SharedService,
        private router: Router,
        private fb: FormBuilder,
        private messageService: MessageService,
        private logoutService: LogoutService
    ) {
        this.abusForm = fb.group({
            "first": '',
            "max": '',
            "statut": '',
            "date_deb": '',
            "date_fin": '',
            "emetter": '',
            "user_report": ''
        });
    }
    ngOnInit() {
        this.abusForm.patchValue({ first: 1, max: 10 });
        this.filtre = this.abusForm.value,
            this.getListAbus(1);
    }

    getEmptyMessage(): string {
        return this.rows && this.rows.length > 0 ? '' : 'Aucun résultat';
    }

    getListAbus(page): void {
        // let offset = 10 * (page - 1) + 1;
        let offset = 10 * (page - 1);
        //console.log(offset);
        this.loading = true;
        this.listAbus = [];
        this.adminService.listAbus(offset, 10, JSON.stringify(this.filtre)).subscribe(listAbus => {
            this.loading = false;
            this.listAbus = listAbus.value;
            this.length = listAbus.nbResults;
            this.onChangeTable(this.config);
        }, err => {
            this.errorCallback(err);
        });
    }
    public onChangeTable(config: any, page: any = { page: this.page, itemsPerPage: this.itemsPerPage }): any {

        if (config.filtering) {
            Object.assign(this.config.filtering, config.filtering);
        }

        if (config.sorting) {
            Object.assign(this.config.sorting, config.sorting);
        }

        this.changePage(page, this.listAbus);
    }

    public setPage(config: any, page: any = { page: this.page }): any {
        this.sharedService.setAbusPage(page.page);
    }

    changeItemsPerPage(itemsPerPage) {
        this.itemsPerPage = itemsPerPage;
        this.onChangeTable(this.config);
    }

    public changePage(page: any, data: Array<any> = this.listAbus) {
        this.loading = true;
        let start = (page.page - 1) * page.itemsPerPage;
        let end = page.itemsPerPage > -1 ? (start + page.itemsPerPage) : data.length;

        let eventPage: number = page.page;
        this.sharedService.getAbusPage().subscribe(AbusPage => {
            eventPage = AbusPage;
        });
        this.abusForm.patchValue({ first: eventPage, max: this.itemsPerPage });
        this.filtre = this.abusForm.value,
            console.log(this.filtre);
        this.listAbus = [];
        this.adminService.listAbus(eventPage, 10, JSON.stringify(this.filtre)).subscribe(listAbus => {
            this.loading = false;
            listAbus.value.forEach(abus => {
                abus['btnPrevenir'] = '<button disabled type="button"  data-id=' + abus.uid + '  class="btn btn-success">Prévenir</button>';
                abus['btnSuspendre'] = '<button disabled type="button"  data-id=' + abus.uid + '  class="btn btn-success">Suspendre</button>';
                abus['btnNothing'] = '<button disabled type="button"  data-id=' + abus.uid + '  class="btn btn-success">Aucune action</button>';
            });
            this.rows = listAbus.value;
        }, err => {
            this.loading = false;
            this.errorCallback(err);
        });
    }

    successCallback(msg): void {
        this.loading = false;
        this.msgs = [];
        this.msgs.push({ severity: 'success', summary: '', detail: msg });
    }

    errCallback(msg): void {
        if (msg.status === 401) {
            this.logoutService.logout();
        } else {
            this.loading = false;
            this.msgs = [];
            this.msgs.push({ severity: 'error', summary: '', detail: msg });
        }
    }

    public preventUser(event): void {
        let data = {
            idAction: 1,
            uidAbus: event.row.uid
        }
        console.log(data);
        this.adminService.performAction(data)
            .subscribe(res => {
                this.getListAbus(1);
                const msg = res.status_desc + " à l'utilisateur : " + event.row.pseudoRep;
                this.successCallback(msg);
            }, err => {
                this.errCallback(err);
            });
    }

    public suspendUser(event): void {
        let data = {
            idAction: 2,
            uidAbus: event.row.uid
        };
        this.adminService.performAction(data)
            .subscribe(res => {
                this.getListAbus(1);
                const msg = "L'utilisateur : " + event.row.pseudoRep + " a été suspendu";
                this.successCallback(msg);
            }, err => {
                this.errCallback(err);
            });
    }

    public nothnigAction(event): void {
        let data = {
            idAction: 3,
            uidAbus: event.row.uid
        };
        this.adminService.performAction(data)
            .subscribe(res => {
                this.getListAbus(1);
                const msg = "Aucune action faite, l'abus a été traité";
                this.successCallback(msg);
            }, err => {
                this.errCallback(err);
            });
    }

    public onCellClick(event: any): any {
        switch (event.column) {
            case 'btnPrevenir': this.preventUser(event); break;
            case 'btnSuspendre': this.suspendUser(event); break;
            case 'btnNothing': this.nothnigAction(event); break;
            default: this.sharedService.showDetailAbusEvent.next(event);
                this.router.navigate(["/administration/abus-detail", event.row.uid]); break;
        }
    }

    errorCallback(err): void {
        console.log(err);
        this.loading = false;
    }

    getAllListAbus(): void {
        this.abusForm.patchValue({ first: 1, date_deb: undefined, date_fin: undefined, max: 10, statut: '', emetter: undefined, user_report: undefined });
        this.filtre = this.abusForm.value;
        this.sharedService.setAbusPage(1);
        this.date_deb = undefined;
        this.date_fin = undefined;
        this.user_report = undefined;
        this.emetter = undefined;
        this.onChangeTable(this.config);
    }

    getSearch(form: FormGroup): void {
        //let data=JSON.stringify(value);
        this.filtre = form.value;
        this.getListAbus(this.page);
    }

}
