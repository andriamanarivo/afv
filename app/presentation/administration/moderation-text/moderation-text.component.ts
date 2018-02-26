import { Component, OnInit, ViewChild } from '@angular/core';
import { AppConfig } from 'app/contrainte/config/_app/app.config';
import { AdministrationApplicatifServiceACI } from 'app/service/applicatif/administration';
import { BsModalRef, BsModalService, ModalDirective } from 'ngx-bootstrap/modal';
import { Message as MessagePrimeNg } from 'primeng/primeng';
import { MessageService } from 'primeng/components/common/messageservice';


@Component({
    selector: 'app-moderation-text',
    templateUrl: './moderation-text.component.html',
    styleUrls: ['./moderation-text.component.css'],
    providers: [MessageService]
})
export class ModerationTextComponent implements OnInit {
    currentDescription: any;
    @ViewChild('childModal') public childModal: ModalDirective;
    columns: Array<any> = [];
    config: any;
    criteria: any = {};
    isLoading = false;
    isSearch: boolean;
    itemsPerPage = 20;
    length = 0;
    maxSize = 5;
    numPages = 1;
    page = 1;
    rows: Array<any> = [];
    sortValue = "0";
    tempConfig: any;
    statutValue = "";
    msgs: MessagePrimeNg[] = [];

    constructor(
        private appConfig: AppConfig,
        private adminService: AdministrationApplicatifServiceACI,
        private bsModalRef: BsModalRef,
        private modalService: BsModalService,
        private messageService: MessageService,
    ) { }

    ngOnInit() {
        this.setColumns();
        this.setConfig();
        this.onChangeTable(this.config);
    }
   
    setColumns(): void {
        this.columns = [
            { title: 'Description', name: 'text', sort: false },
            { title: 'Pseudo', name: 'pseudo', sort: false },
            { title: 'Date de création', name: 'dateCr', sort: false },        
            { title: 'Statut', name: 'statut', sort: false },        
            { title: 'Rejeter', name: 'btnRejetText', sort: false },
            { title: 'Accepter', name: 'btnAcceptText', sort: false }
        ]
    }

    setConfig(): void {
        this.itemsPerPage = this.appConfig.getConfig('adminItemsPerPage');
        this.criteria = {
            isTri: true,
            desc: true,
            first: 1,
            max: this.itemsPerPage,
            filter: { rejected: '', email: '', pseudo: '' }
        }
        this.config = {
            paging: true,
            sorting: { columns: this.columns },
            filtering: { filterString: '' },
            className: ['table-striped', 'table-bordered']
        }
    }

    searchDescriptions(statut, pseudo: string, email:string): void {        
        this.criteria.filter = { rejected:  statut === '1' ? true : (statut === '0' ? false : ''), email: email, pseudo: pseudo };
        this.criteria.isTri = false;
        this.criteria.desc = false;
        this.isSearch = true;
        this.onChangeTable(this.config);
    }

    showAllDescriptions(): void {
        this.isSearch = true;
        this.statutValue = '';
        this.setColumns();
        this.setConfig();
        this.onChangeTable(this.config);
    }

    sortByDate(): void {
        this.criteria.isTri = true;
        this.criteria.desc = this.sortValue === "0" ? true : false;
        this.isSearch = true;
        this.onChangeTable(this.config);
    }

    onChangeTable(config: any, page: any = { page: this.page, itemsPerPage: this.itemsPerPage }): void {       
        const d = { config: config, page: page };
        let res;
        if (this.tempConfig) {
            res = this.isSameConfig(this.tempConfig, d);
        }
        if (!res || this.isSearch) {
            this.criteria.first = (page.page - 1) * 20;
            this.isLoading = true;          
            this.rows = [];
            this.adminService.getDescriptions(this.criteria)
                .subscribe(res => {                   
                    this.tempConfig = {
                        config: JSON.parse(JSON.stringify(config)),
                        page: JSON.parse(JSON.stringify(page))
                    };
                    this.successCallback(res);
                }, err => {                   
                    this.errorCallback(err);
                });
        }
    }

    successCallback(res: any) {        
        this.isSearch = false;
        this.criteria.isTri = false;
        this.isLoading = false;
        if (res['descriptions'] && res['descriptions'].length !== 0) {
            let descriptions = res['descriptions'];
            descriptions.forEach(description => {
                description['moderation'] = description.statutModeration;
                description['statutModeration'] = '<a class=\'btnEdits\'><span class=\"editTerme\"  data-id=' + description.uid + '><i class=\"fa fa-pencil-square-o\" ></i> </span>' + (description.moderation ? 'Modéré' : 'A modérer') + '</a>';
                description['btnRejetText'] = '<button type="button"  data-id=' + description.uid + '  class="btn btn-success">Rejeter</button>';
                description['btnAcceptText'] = '<button type="button"  data-id=' + description.uid + '  class="btn btn-success">Accepter</button>';                
                description['statut'] = description.rejected ? 'Rejété' : 'Accépté';
            });
            this.rows = descriptions;
            this.length = res['nbResults'];
        } else {            
            this.length = 0;
            this.rows = [];
        }
    }

    errorCallback(err: any): void {
        this.isLoading = false;
        this.isSearch = false;
        this.criteria.isTri = false;       
    }

    isSameConfig(lastConfig, newConfig) {
        return lastConfig.config.filtering.filterString === newConfig.config.filtering.filterString
            && lastConfig.config.filtering.paging === newConfig.config.filtering.paging &&
            // this.isSameSorting(lastConfig.config.sorting.columns, newConfig.config.sorting.columns) &&
            lastConfig.page.page === newConfig.page.page;
    }

    onCellClick(event): void {
        switch (event.column) {
            case 'statutModeration': this.showUpdateModerationModal(event); break;
            case 'btnRejetText': this.rejectDescription(event); break;
            case 'btnAcceptText': this.acceptDescription(event); break;
            case 'btnAccept': this.updateStatutModeration(event.row.uid); break;
            default: break;
        }
    }

    showUpdateModerationModal(event: any): void {
        this.currentDescription = event.row;      
        this.currentDescription.moderation = +this.currentDescription.moderation;
        this.childModal.show();
        this.childModal.onHide.subscribe(res => {
            this.currentDescription = {};
        });
    }

    acceptDescription(event: any): void {
        this.adminService.acceptDescription(event.row.uid)
            .subscribe(res => {                
                if (!res.error) {
                    this.updateStatutDescriptionSuccesCallback("Description acceptée");                    
                    this.isSearch = true;
                    this.onChangeTable(this.tempConfig.config, this.tempConfig.page);
                }
            }, err => {
                this.errorCallback(err);
            });
    }

    rejectDescription(event: any): void {
        this.adminService.rejectDescription(event.row.uid)
            .subscribe(res => {               
                if (!res.error) {
                    this.updateStatutDescriptionSuccesCallback("Description rejetée");
                    this.isSearch = true;
                    this.onChangeTable(this.tempConfig.config, this.tempConfig.page);
                }
            }, err => {
                this.errorCallback(err);
            });
    }

    updateStatutDescriptionSuccesCallback(msg): void {       
        this.msgs = [];
        this.msgs.push({ severity: 'success', summary: '', detail: msg });
    }

    updateStatutModeration(uid): void {
        //console.log(uid);
        // this.adminService.changeStatutModerationDescription(uid)
        //     .subscribe(res=>{
        //         //console.log(res);
        //         //console.log(this.tempConfig);
        //         if(!res.response.error){                   
        //             this.isSearch = true;
        //             this.onChangeTable(this.tempConfig.config, this.tempConfig.page);
        //         }
        //     },err=>{
        //         //console.log(err);
        //     });
    }

    getEmptyMessage() {
        return this.rows && this.rows.length > 0 ? '' : 'Aucun résultat pour votre recherche';
    }

    changeItemsPerPage(nb: number): void {
        this.criteria.max = nb;
        this.isSearch = true;
        this.onChangeTable(this.config);
    }

}
