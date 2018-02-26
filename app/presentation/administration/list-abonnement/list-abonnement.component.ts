import { Component, OnInit, EventEmitter } from '@angular/core';
import { AdministrationApplicatifServiceACI } from "../../../service/applicatif/administration/administration.applicatif.service.aci";
import { SharedService } from '../../../commun/shared-service';
import { Router } from "@angular/router";

@Component({
  selector: 'app-list-abonnement',
  templateUrl: './list-abonnement.component.html',
  styleUrls: ['./list-abonnement.component.css']
})


export class ListAbonnementComponent implements OnInit {
    rows: Array<any> = [];
    showDetailEvent = new EventEmitter();
    listAbonnement = [];
    maxPerPage = 20;
    columns: Array<any> = [
        { title: 'Pseudo', name: 'pseudo', sort: false },
        { title: 'Libellé abonnement', name: 'titre', sort: false },
        { title: 'Statut', name: 'statut', sort: false },
        { title: 'Date début', name: 'dateSouscription', sort: false },
        { title: 'Date fin', name: 'dateExpiration', sort: false },
        { title: 'Renouvellement', name: 'nouveau', sort: false },
        { title: 'Suspendre', name: 'suspendu', sort: false },
        { title: 'Stop revolving', name: 'stop', sort: false },
    ];
    page: number = 1;
    itemsPerPage: number = 10;
    maxSize: number = 5;
    numPages: number = 1;
    length: number = 0;
    loading: boolean = false;
    config: any = {
        paging: true,
        className: ['table-striped', 'table-bordered']
    };
  constructor(private adminService:AdministrationApplicatifServiceACI,
              private sharedService:SharedService,
              private router: Router) { }

  ngOnInit() {
    this.getListAbonnement(1);
  }

  getListAbonnement(page): void {
        // let offset = 10 * (page - 1) + 1;
        let offset = 10 * (page - 1) ;  
        this.loading = true;
        this.adminService.listAbonnement(offset, this.itemsPerPage).subscribe(listAbonnement => {
            this.loading = false;
            this.listAbonnement = listAbonnement.value;
            this.length = listAbonnement.nbResults;
            this.onChangeTable(this.config);
        }, err => {
            this.errorCallback(err);
        });
  }

    getEmptyMessage(): string {
        return this.rows && this.rows.length > 0 ? '' : 'Aucun résultat';
    }

  public onChangeTable(config: any, page: any = { page: this.page, itemsPerPage: this.itemsPerPage }): any {
        if (config.filtering) {
            Object.assign(this.config.filtering, config.filtering);
        }
        this.changePage(page, this.listAbonnement);
  }

    changeItemsPerPage(itemsPerPage) {
        this.itemsPerPage = itemsPerPage;
        this.maxPerPage = itemsPerPage;
        this.onChangeTable(this.config);
    }

    public changePage(page: any, data: Array<any> = this.listAbonnement) {
        this.loading = true;
        let start = (page.page - 1) * page.itemsPerPage;
        let end = page.itemsPerPage > -1 ? (start + page.itemsPerPage) : data.length;
        this.adminService.listAbonnement(page.page, this.itemsPerPage).subscribe(listAbonnement => {
            this.loading = false;
            console.log(listAbonnement.value);
            if(listAbonnement.value.length>0){
                for(var i in listAbonnement.value){
                    if(!listAbonnement.value[i].iSonepay){
                        let stop=listAbonnement.value[i].stopRevolving ==true ? 'disabled':'';
                        listAbonnement.value[i].stop='<button type="button" data-id="'+listAbonnement.value[i].id+'" '+stop+'  class="btn btn-success btn_stop">Stop</button>';
                    }else{
                        listAbonnement.value[i].stop='';
                    }
                    if(listAbonnement.value[i].statut==='ACTIF'){
                        listAbonnement.value[i].nouveau='<button type="button" data-id="'+listAbonnement.value[i].id+'" disabled class="btn btn-success">Renouveler</button>';
                        listAbonnement.value[i].suspendu='<button type="button" data-id="'+listAbonnement.value[i].id+'" class="btn btn-success btn_suspendu">Suspendre</button>';
                    }else if(listAbonnement.value[i].statut==='SUSPENDU'){
                        listAbonnement.value[i].nouveau='<button type="button" data-id="'+listAbonnement.value[i].id+'" disabled class="btn btn-success">Renouveler</button>';
                        listAbonnement.value[i].suspendu='<button type="button" data-id="'+listAbonnement.value[i].id+'" class="btn btn-success btn_reprendre">Reprendre</button>';
                    }else{
                        listAbonnement.value[i].suspendu='<button type="button" data-id="'+listAbonnement.value[i].id+'" disabled class="btn btn-success">Reprendre</button>';
                        listAbonnement.value[i].nouveau='<button type="button" data-id="'+listAbonnement.value[i].id+'" class="btn btn-success btn_nouveau">Renouveler</button>';
                    }
                }
            }
            this.rows = listAbonnement.value;
        }, err => {
            this.loading = false;
            this.errorCallback(err);
        });
    }

    errorCallback(err): void{
        console.log(err);
        this.loading = false;
    }

    public onCellClick(data: any): any {
        this.loading = true;
        let passeBtm=0;
        if(data.column=='suspendu' && data.row.statut==='ACTIF'){
            passeBtm=1;
            this.adminService.suspendAbonnent(data.row.id).subscribe(result => {
                //if(result.status==200){
                    this.getListAbonnement(1);
                //}
            }, err => {
                this.loading = false;
                this.errorCallback(err);
            });
        }
        if(data.column=='suspendu'&& data.row.statut==='SUSPENDU'){
            passeBtm=1;
            this.adminService.reprendreAbonnement(data.row.id).subscribe(result => {
                //if(result.status==200){
                    this.getListAbonnement(1);
                //}
            }, err => {
                this.loading = false;
                this.errorCallback(err);
            });
        }
        let nouveau=false;
        if(data.column=='nouveau'&&data.row.statut==='SUSPENDU' || data.column=='nouveau'&&data.row.statut==='ACTIF'){
           nouveau=true;
        }

        if(data.column=='nouveau'&&nouveau===false){
             passeBtm=1;
            this.adminService.newAbonnement(data.row.id).subscribe(res => {
                //if(res.status==200){
                    this.getListAbonnement(1);
                //}
            }, err => {
                this.loading = false;
                this.errorCallback(err);
            });
        }
        
        if(data.column=='stop' && data.row.stopRevolving===false){
            passeBtm=1;
            this.adminService.stopAbonnement(data.row.id).subscribe(result => {
                    this.getListAbonnement(1);
            }, err => {
                this.loading = false;
                this.errorCallback(err);
            });
        }
        if(passeBtm===0){
            this.loading = false;
        }
       
    }

}
