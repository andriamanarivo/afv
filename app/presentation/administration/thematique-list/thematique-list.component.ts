import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AdministrationApplicatifServiceACI } from '../../../service/applicatif/administration';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { TranslateService, LangChangeEvent } from 'ng2-translate';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';
import { MessageDialogComponent } from '../message-dialog/message-dialog.component';



@Component({
  selector: 'app-site-list',
  templateUrl: './thematique-list.component.html',
  styleUrls: ['./thematique-list.component.css']
})
export class thematiqueListComponent implements OnInit {
  public rows:Array<any> = [];
  public columns:Array<any> = [];
  public page:number = 1;
  public itemsPerPage:number = 10;
  public maxSize:number = 5;
  public numPages:number = 1;
  public length:number = 0;
  public config : any ;
  public data:Array<any>;
  constructor(
      private administrationApplicatifService: AdministrationApplicatifServiceACI,
      private router: Router,
      private bsModalRef : BsModalRef,
      private modalService: BsModalService
  ) {

  }

  ngOnInit() {
      this.config = {
          add: {
              confirmCreate: true,
              addButtonContent: 'Nouveau',
              createButtonContent:'<span><i class=\"fa fa-floppy-o\" ></i> </span>',
              cancelButtonContent : '<span><i class=\"fa fa-undo\" ></i> </span>'   
          },
          edit: {
              confirmSave : true,
              editButtonContent: '<span><i class=\"fa fa-pencil-square-o\" ></i> </span>',
              saveButtonContent : '<span><i class=\"fa fa-floppy-o\" ></i> </span>',
              cancelButtonContent : '<span><i class=\"fa fa-undo\" ></i> </span>'
          },
          delete: {
              confirmDelete : true,
              deleteButtonContent: `<span><i class=\"fa fa-trash-o\" ></i></span>`,
          },
          actions : {
            position: 'right',
            add: true,
            edit: true,
            delete: true
        },
          columns: {
              id: {
                  title: 'ID',
                  editable : false
              },
              libelle: {
                  title: 'Libelle'
              }
          },
          noDataMessage: 'Aucun résultat'
      };
      this.initializeData();
  }
    onCreateConfirm(event){
        let self = this;
        let data = { "libelle":event.newData.libelle, "uid":"" };
        this.administrationApplicatifService.addUpdateThematique(data).subscribe(
            ()=>{
                event.newData.id =1;
                for(var i = 0 ; i<self.data.length;i++){
                    self.data[i].id =self.data[i].id+1;
                }
                event.confirm.resolve(event.newData);
                this.initializeData();
            })
    }

    onSaveConfirm(event){
        let data = { "libelle":event.newData.libelle, "uid":event.newData.uid};
        this.administrationApplicatifService.addUpdateThematique(data).subscribe(
            ()=>{
                event.confirm.resolve(event.newData);
            })
    }

    public openConfirmModal(event) {
        this.bsModalRef = this.modalService.show(ConfirmDialogComponent);
        var modalComponent = this.bsModalRef.content as ConfirmDialogComponent;
        let data = {
            'title' : 'Confirmation suppression',
            'content' : 'Voulez-vous vraiment supprimer cette thématique ?'
        }

        modalComponent.model = data;
        modalComponent.afterModelLoad();
        modalComponent.out.subscribe((result) => {
            if(result.data){
                this.deleteThematique(event);
            }
        });

    }

    public openMessageModal() {
        this.bsModalRef = this.modalService.show(MessageDialogComponent);
        var modalComponent = this.bsModalRef.content as MessageDialogComponent;
        let data = {
            'title' : '',
            'content' : 'Impossible de supprimer la thématique car elle est actuellement utilisée'
        }

        modalComponent.model = data;
        modalComponent.afterModelLoad();
    }

    onDeleteConfirm(event){
        if(event.data.isDelete){
           this.openConfirmModal(event);
        }
        else{
            this.openMessageModal();
        }
    }

    deleteThematique(event){
        this.administrationApplicatifService.deleteThematique(event.data.uid)
                .subscribe(data => {
                    event.confirm.resolve(event.data);
                    // this.initializeData();
                },
                err => {
                    console.log(err);
        });
    }

  initializeData(){
      this.administrationApplicatifService.getThematiques()
          .subscribe(data => {
              let sites = []
              for(var i = 0 ; i<data.length;i++){
                  sites.push( {"id":i+1,"libelle":data[i].libelle, "uid": data[i].uid , "isDelete": data[i].isDelete } );
              }

              this.data = sites;
          },
          err => {
              console.log(err);
          });

  }
}
