import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AdministrationApplicatifServiceACI } from '../../../service/applicatif/administration';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { TranslateService, LangChangeEvent } from 'ng2-translate';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';
import { MessageDialogComponent } from '../message-dialog/message-dialog.component';


@Component({
  selector: 'app-couleur-list',
  templateUrl: './couleur-list.component.html',
  styleUrls: ['./couleur-list.component.css']
})
export class couleurListComponent implements OnInit {
  public rows: Array<any> = [];
  public columns: Array<any> = [];
  public page: number = 1;
  public itemsPerPage: number = 10;
  public maxSize: number = 5;
  public numPages: number = 1;
  public length: number = 0;
  public config : any ;
  public data: Array<any>;
  constructor(
      private administrationApplicatifService: AdministrationApplicatifServiceACI,
      private router: Router,
      private bsModalRef: BsModalRef,
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
    onCreateConfirm(event) {
        const self = this;
        const data = { 'libelle': event.newData.libelle, 'uid': '' };
        this.administrationApplicatifService.addUpdateCouleur(data).subscribe(
            () => {
                event.newData.id = 1;
                for (let i = 0 ; i < self.data.length; i++) {
                    self.data[i].id = self.data[i].id + 1;
                }
                // event.confirm.resolve(event.newData);
                this.initializeData();
            });
    }

    onSaveConfirm(event){
        const data = { 'libelle': event.newData.libelle, 'uid': event.newData.uid};
        this.administrationApplicatifService.addUpdateCouleur(data).subscribe(
            () => {
                event.confirm.resolve(event.newData);
            });
    }

  initializeData(){
      this.administrationApplicatifService.getCouleur()
          .subscribe(data => {
              const sites = []
              for (let i = 0 ; i < data.length; i++){
                  sites.push( {'id': i + 1, 'libelle': data[i].libelle, 'uid': data[i].uid, 'isDelete': data[i].isDelete  } );
              }

              this.data = sites;
          },
          err => {
              console.log(err);
          });

  }
    onDeleteConfirm(event) {
        if (event.data.isDelete) {
            this.openConfirmModal(event);
        } else{
            this.openMessageModal();
        }
    }

    public openConfirmModal(event) {
        this.bsModalRef = this.modalService.show(ConfirmDialogComponent);
        const modalComponent = this.bsModalRef.content as ConfirmDialogComponent;
        const data = {
            'title' : 'Confirmation suppression',
            'content' : 'Voulez-vous vraiment supprimer cette couleur ?'
        };

        modalComponent.model = data;
        modalComponent.afterModelLoad();
        modalComponent.out.subscribe((result) => {
            if (result.data){
                this.deleteColor(event);
            }
        });

    }

    public openMessageModal() {
        this.bsModalRef = this.modalService.show(MessageDialogComponent);
        const modalComponent = this.bsModalRef.content as MessageDialogComponent;
        const data = {
            'title' : '',
            'content' : 'Impossible de supprimer la couleur car elle est actuellement utilisée'
        }

        modalComponent.model = data;
        modalComponent.afterModelLoad();
    }

    deleteColor(event){
        this.administrationApplicatifService.deleteCouleur(event.data.uid)
                .subscribe(data => {
                    event.confirm.resolve(event.data);
                },
                err => {
                    console.log(err);
                });
    }
}
