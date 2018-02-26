import { Component, OnInit, EventEmitter,  ViewChild, ViewContainerRef, Input} from '@angular/core';
import { AdministrationApplicatifServiceACI } from "../../../service/applicatif/administration/administration.applicatif.service.aci";
import { SharedService } from '../../../commun/shared-service';
import { Router } from "@angular/router";
import {FormGroup,FormBuilder,FormControl} from '@angular/forms';
import {DatePickerComponent,ModalDirective} from 'ngx-bootstrap';
import {IMultiSelectOption} from 'angular-2-dropdown-multiselect';
import {Message as MessagePrimeNg} from 'primeng/primeng';
import { DomSanitizer } from '@angular/platform-browser';

import { MessageService } from 'primeng/components/common/messageservice';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';
import { SwitchCheckboxComponent } from '../switch-checkbox/switch-checkbox.component';

@Component({
    selector: 'app-list-termes-interdit',
    templateUrl: './list-termes-interdit.component.html',
    styleUrls: ['./list-termes-interdit.component.css'],
    providers:[MessageService]
})
export class ListTermesInterditComponent implements OnInit {
    rows: Array<any> = [];
    showDetailEvent = new EventEmitter();
    listTerms = [];
    msgs: MessagePrimeNg[] = [];
    types: IMultiSelectOption[];
    typeModif: IMultiSelectOption[];
    optionsModel: number[];
    optionsEdit: Array<string> = [];
    termeEdit:string;
    termeCree:string;
    idEdit:number;
    page: number = 1;
    itemsPerPage: number = 20;
    maxSize: number = 5;
    numPages: number = 1;
    length: number = 0;
    loading: boolean = false;
    config: any = {
        paging: true,
        className: ['table-striped', 'table-bordered']
    };
    formGroup : FormGroup;
    formEdit : FormGroup;
    public data:Array<any>;
    public input: string = '<input type="checkbox"></input>';
     @ViewChild('childModal') public childModal:ModalDirective;
     title:string="Modifier terme";
    constructor(private adminService: AdministrationApplicatifServiceACI, 
                private sharedService: SharedService, 
                private router: Router,
                private fb: FormBuilder,
                private bsModalRef : BsModalRef,
                private modalService: BsModalService,
                private _sanitizer:DomSanitizer
                ) { }
    ngOnInit() {
        this.configTable();
        this.getListATerme(1);
    }

    configTable(){
        this.config = {
            add: {
                confirmCreate: true,
                addButtonContent: 'Nouveau',
                createButtonContent:'<span><i class=\"fa fa-floppy-o\" ></i> </span>',
                cancelButtonContent : '<span><i class=\"fa fa-undo\" ></i> </span>'     
            },
            edit: {
                confirmSave: true,
                editButtonContent: '<span><i class=\"fa fa-pencil-square-o\" ></i> </span>',
                saveButtonContent : '<span><i class=\"fa fa-floppy-o\" ></i> </span>',
                cancelButtonContent : '<span><i class=\"fa fa-undo\" ></i> </span>'                
            },
            delete: {
                confirmDelete: true,
                deleteButtonContent: '<span><i class=\"fa fa-trash-o\" ></i></span>',
            },
            actions : {
                position: 'right',
                add: true,
                edit: true,
                delete: true
            },
            pager : {
                display : true,
                perPage:this.itemsPerPage
            },
            columns: {
              id: {
                  title: 'ID',
                  editable : false
              },
              value: {
                  title: 'Terme'
              },
              pseudo:{
                title: 'Pseudo',
                //valuePrepareFunction: (value) => { return this._sanitizer.bypassSecurityTrustHtml(this.input); },
                type: 'custom',
                valuePrepareFunction: (data) => {
                return {
                    'columnName' : 'pseudo',
                    'columnValue' : data
                }
                },
                renderComponent: SwitchCheckboxComponent,
                filter: {
                    type: 'list',
                    config: {
                        selectText: 'Sélectionner',
                        list: [
                            { value: true, title: 'Oui'  },
                            { value: false, title: 'Non'  },
                        ],
                    },
                },
                editor: {
                    type: 'list',
                    config: {
                    selectText: 'Sélectionner',
                    list: [
                        { value: true, title: 'Oui'  },
                        { value: false, title: 'Non'  },
                    ],
                    },
                },
              },
              profil:{
                title: 'Profil',
                type: 'custom',
                valuePrepareFunction: (data) => {
                return {
                    'columnName' : 'profil',
                    'columnValue' : data
                }
                },
                renderComponent: SwitchCheckboxComponent,
                filter: {
                    type: 'list',
                    config: {
                        selectText: 'Sélectionner',
                        list: [
                            { value: true, title: 'Oui' },
                            { value: false, title: 'Non' },
                        ],
                    },
                },
                editor: {
                    type: 'list',
                    config: {
                    selectText: 'Sélectionner',
                    list: [
                        { value: true, title: 'Oui'  },
                        { value: false, title: 'Non'  },
                    ],
                    },
                },
              },
              tchat:{
                title: 'Tchat',
                type: 'custom',
                valuePrepareFunction: (data) => {
                return {
                    'columnName' : 'tchat',
                    'columnValue' : data
                }
                },
                renderComponent: SwitchCheckboxComponent,
                filter: {
                    type: 'list',
                    config: {
                        selectText: 'Sélectionner',
                        list: [
                            { value: true, title: 'Oui'  },
                            { value: false, title: 'Non'  },
                        ],
                    },
                },
                editor: {
                    type: 'list',
                    config: {
                    selectText: 'Sélectionner',
                    list: [
                        { value: true, title: 'Oui'  },
                        { value: false, title: 'Non'  },
                    ],
                    },
                },
              }
          },
          noDataMessage: 'Aucun résultat'
      };
    }
    getListATerme(page): void {
        let offset = 10 * (page - 1) ;  
        
        this.adminService.listTerme(1,this.itemsPerPage).subscribe(terme => {
            console.log(terme);
            this.loading = false;
            this.listTerms = terme.value;
            this.length = terme.nbResults;
            this.onChangeTable(this.config);
        }, err => {
            this.errorCallback(err);
        });
    }

    changeItemsPerPage(itemsPerPage) {
        this.itemsPerPage = itemsPerPage;
        this.configTable();
        this.onChangeTable(this.config);
    }

    public onChangeTable(config: any, page: any = { page: this.page, itemsPerPage: this.itemsPerPage }): any {
        
        if (config.filtering) {
            Object.assign(this.config.filtering, config.filtering);
        }

        if (config.sorting) {
            Object.assign(this.config.sorting, config.sorting);
        }

        this.changePage(page, this.listTerms);
    }

    public setPage(config: any, page: any = { page: this.page }): any {
        this.sharedService.setAbusPage(page.page);
    }

    public changePage(page: any, data: Array<any> = this.listTerms) {
        this.loading = true;
        console.log("changePage");
        let start = (page.page - 1) * page.itemsPerPage;
        let end = page.itemsPerPage > -1 ? (start + page.itemsPerPage) : data.length;
        
        this.adminService.listTerme(page.page, this.itemsPerPage).subscribe(terme => {
            let listterme=[];
            if(terme.value.length>0)
                listterme=terme.value[0];

             let termes = []
              for(var i = 0 ; i < listterme.length; i++){
                  if(listterme[+i].pseudo===1){
                        listterme[+i].pseudo=true;
                    }else{
                        listterme[+i].pseudo=false;
                    }
 
                    if(listterme[+i].profil===1){
                        listterme[+i].profil=true;
                    }else{
                        listterme[+i].profil=false;
                    }

                    if(listterme[+i].tchat===1){
                        listterme[+i].tchat=true;
                    }else{
                        listterme[+i].tchat=false;
                    }
                    termes.push( {"id":listterme[i].id,"value":listterme[i].value,"pseudo":listterme[i].pseudo,"profil":listterme[i].profil,"tchat":listterme[i].tchat} );
              }

              this.data = termes;
              this.loading = false;
        }, err => {
            this.errorCallback(err);
        });
    }

    deleteTerme(idTerme){
      this.adminService.deleteTerme(idTerme).subscribe(terme => {
            if(terme.status==="DELETED"){
                this.getListATerme(this.page); 
            }
            
        }, err => {
            this.errorCallback(err);
        });
    }
    
    errorCallback(err): void{
        console.log(err);
        this.loading = false;
    }

    onCreateConfirm(event){
        let self = this;
        let pseudo=0;
        let profil=0;
        let tchat=0;
        if(event.newData.pseudo==="true"){
            pseudo=1
        }
        if(event.newData.profil==="true"){
            profil=1;
        }
        if(event.newData.tchat==="true"){
            tchat=1
        }
        let dataTerme ={"id":event.newData.id,"value":event.newData.value, "pseudo": pseudo,"profil": profil,"tchat" : tchat};
        this.adminService.createTerme(JSON.stringify(dataTerme)).subscribe(terme => {
                if(terme.status==="CREATED"){
                    event.confirm.resolve(event.newData);
                    this.getListATerme(this.page); 
                }
            })
    }

    onSaveConfirm(event){
        let pseudo=0;
        let profil=0;
        let tchat=0;

        if(event.newData.pseudo==="true"){
            pseudo=1
        }
        if(event.newData.profil==="true"){
            profil=1;
        }
        if(event.newData.tchat==="true"){
            tchat=1
        }
        
        let dataTerme ={"id":event.newData.id,"value":event.newData.value, "pseudo": pseudo,"profil": profil,"tchat" : tchat};
        
        this.adminService.updateTerme(JSON.stringify(dataTerme)).subscribe(terme => {
            if(terme.status==="UPDATED"){
                event.confirm.resolve(event.newData);
                this.getListATerme(this.page); 
            }
        })
    }

    public openConfirmModal(event) {
        this.bsModalRef = this.modalService.show(ConfirmDialogComponent);
        var modalComponent = this.bsModalRef.content as ConfirmDialogComponent;
        let data = {
            'title' : 'Confirmation suppression',
            'content' : 'Voulez-vous vraiment supprimer ce terme ?'
        }

        modalComponent.model = data;
        modalComponent.afterModelLoad();
        modalComponent.out.subscribe((result) => {
            if(result.data){
                this.deleteTerme(event.data.id);
            }
        });

    }

    onDeleteConfirm(event){
        this.openConfirmModal(event);
    }

}

