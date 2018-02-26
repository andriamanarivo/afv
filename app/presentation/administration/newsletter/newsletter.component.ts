import { Component, OnInit } from '@angular/core';
import {Message as MessagePrimeNg} from 'primeng/primeng';
import { AdministrationApplicatifServiceACI } from "../../../service/applicatif/administration/administration.applicatif.service.aci";
import { Angular2Csv } from 'angular2-csv/Angular2-csv';
import { XlsxService } from '../../../commun/xlsx.service';

@Component({
  selector: 'app-newsletter',
  templateUrl: './newsletter.component.html',
  styleUrls: ['./newsletter.component.css']
})
export class NewsletterComponent implements OnInit {
  config: any = {
        paging: true,
        className: ['table-striped', 'table-bordered']
  };
  msgs: MessagePrimeNg[] = [];
  itemsPerPage: number = 20;
  loading: boolean = false;
  public dataSource:Array<any>;
  constructor(
      private administrationACI: AdministrationApplicatifServiceACI,
      private xlsxService: XlsxService
  ) {

  }

  ngOnInit() {
    this.configTable();
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
            },
            columns: {
              value: {
                  title: 'libelle'
              },
              lettre:{
                title: 'Texte',
              },
              image:{
                title: 'image',
              }
            }
          }
    }

    onCreateConfirm(event){}

    onSaveConfirm(event){}

    onDeleteConfirm(event){}

    onChangeTable(event){}

    changeItemsPerPage(itemsPerPage) {
        this.itemsPerPage = itemsPerPage;
        this.configTable();
        this.onChangeTable(this.config);
    }

    getUserSuscribeNewsletter(){
         let headers = new Headers({
            'Content-Type': 'text/csv'
        });
        this.administrationACI.getSubscribedNewsletter().subscribe(res => {
            console.log(res);
            this.xlsxService.exportAsExcelFile(res,'export');
            /*var options = { 
                fieldSeparator: ',',
                quoteStrings: '"',
                decimalseparator: '.',
                showLabels: true, 
                showTitle: true,
                headers: ['Sexe', 'villeName', 'ville','statut','situation','site','pseudo','pays','orientation','email','dateNaissance','dateNaissanceC']
            };
             var blob = new Blob([res], { type: 'text/csv' });
             var url= window.URL.createObjectURL(blob);
             window.open(url);
            //new  Angular2Csv(res, 'users csv',options);*/
        }, err => {
            console.log(err);
        });
    }

}