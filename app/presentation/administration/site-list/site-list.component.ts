import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { SiteApplicatifServiceACI } from '../../../service/applicatif/site';
import { TranslateService, LangChangeEvent } from 'ng2-translate';

import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';

import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-site-list',
  templateUrl: './site-list.component.html',
  styleUrls: ['./site-list.component.css']
})
export class SiteListComponent implements OnInit {
  /*
  public rows:Array<any> = [];
  public columns:Array<any> = [];
  public page:number = 1;
  public itemsPerPage:number = 10;
  public maxSize:number = 5;
  public numPages:number = 1;
  public length:number = 0;
  
  */

  isLoading: boolean = false;
  public listeSites: Array<any>;
  public config : any ;
  siteName : string;
  thematique : string;
  alertCssClass : string;
  public informationMessage : string = '';
  userAlreadyUsedSite : string;

  deleteSuccess : string;
  deleteError : string;
  uidSite : string;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private translate: TranslateService,
    private bsModalRef : BsModalRef,
    private modalService: BsModalService,
    private siteApplicatifService: SiteApplicatifServiceACI
  ) {
     
  }

  ngOnInit() {
    // let siteDetailEtat = this.route.snapshot.data['etat'];
    this.route.params.forEach((params: Params) => {
        if (params['etat']){
            this.alertCssClass = 'success';
            this.informationMessage =  params['etat'];
        }
    });

    this.alertCssClass = 'info';
    this.initializetranslate();
    this.initializeConfig();
    this.initializeData();
  }

  initializetranslate(){
    this.translate.get('thematique').subscribe((res: string) => {
        this.thematique = res;
    });
    this.translate.get('siteName').subscribe((res: string) => {
        this.siteName = res;
    });
    this.translate.get('userAlreadyUsedSite').subscribe((res: string) => {
        this.userAlreadyUsedSite = res;
    });
    this.translate.get('deleteSuccess').subscribe((res: string) => {
        this.deleteSuccess = res;
    });
    this.translate.get('deleteError').subscribe((res: string) => {
        this.deleteError = res;
    });
   }

  initializeConfig() {
    this.config = {
        actions : {
            position: 'right',
            add: false,
            edit: false,
            delete: false ,
            custom: [
                {
                    name: 'deleteSite',
                    title: `<span><i class=\"fa fa-trash-o\" ></i></span>`

                }
            ]
        },
        columns: {
            titre: {
                title: this.siteName,
                filter: false
            },
            thematique: {
                title: this.thematique,
                filter: false
            }
            /*,isDelete: {
                title: "Deletable",
                filter: false
            }*/
        }
      };
  }

  initializeData(){
      this.isLoading = true;
      this.siteApplicatifService.getSites()
          .subscribe(data => {
              const sites = []
              for (let i = 0 ; i < data.length; i++) {
                  sites.push( {
                      'id': data[i].idSite, 'uidSite': data[i].uidSite,
                      'titre': data[i].libSite, 'thematique': data[i].libThematique , 'isDelete' : data[i].isDelete  } );
              }
              this.isLoading = false;
              this.listeSites = sites;
          },
          err => {
              this.alertCssClass = 'danger';
                this.informationMessage = err;
              this.isLoading = false;
          });
  }


    public openConfirmModal(uidSite, siteName) {
        this.bsModalRef = this.modalService.show(ConfirmDialogComponent);
        const modalComponent = this.bsModalRef.content as ConfirmDialogComponent;
        const data = {
            'title' : 'Confirmation suppression du site',
            'content' : 'Voulez vous vraiment supprimer le site : ' + siteName + ''
        }

        modalComponent.model = data;
        modalComponent.afterModelLoad();
        modalComponent.out.subscribe((result) => {
            // do sth with output
            if (result.data){
                this.deleteSite(uidSite);
                // alert(`suppression du site '${siteName}' dont id est : ${uidSite}`)
            }
        });

    }


  onCustom(event) {
    this.uidSite = event.data.uidSite;
    // ModalSmall.show();
    // console.log(event.data.uidSite);
    // alert(`Custom event '${event.action}' fired on row №: ${event.data.id}`)
    if (event.action === 'deleteSite'){
        if (event.data.isDelete){
            this.informationMessage = '';
            // this.deleteSite(event.data.uidSite);
            this.openConfirmModal(event.data.uidSite, event.data.titre);
        } else {
            this.alertCssClass = 'danger';
            this.informationMessage =  event.data.titre + ' : ' + this.userAlreadyUsedSite;
        }
    }
  }

  deleteSite(uidSite)
  {
    this.siteApplicatifService.deleteSite(uidSite)
    .subscribe(res => {
            // event.confirm.resolve(event.data);
            if (res.status === 200 || res.hasError === 200){
                this.informationMessage = this.deleteSuccess;
                this.alertCssClass = 'success';
                this.initializeData();
            } else {
                this.informationMessage = this.deleteError;
                this.alertCssClass = 'danger';
            }

        },
        err => {
            this.alertCssClass = 'danger';
            this.informationMessage = this.deleteError;

        });
  }

  onDeleteConfirm(event){
        if (event.data.isDelete){
            this.deleteSite(event.data.uidSite);
        } else {
            this.alertCssClass = 'danger';
            this.informationMessage = this.userAlreadyUsedSite;
        }
    }
  onRowSelect(event): void {
      // console.log(event);
      if (event.data.uidSite){
        this.router.navigate(['/administration/site/' + event.data.uidSite]);
      }
      // this.router.navigate(['/administration/site/' + data.row.uidSite]);
  }

  newSite(): void {
    this.router.navigate(['/administration/site/' + '0']);
  }
}
