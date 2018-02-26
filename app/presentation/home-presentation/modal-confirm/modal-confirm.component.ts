import { Component, OnInit, 
  Input, Output, EventEmitter,
  ChangeDetectorRef } from '@angular/core';
import { BsModalRef, BsModalService  } from 'ngx-bootstrap/modal';
import { SharedService } from '../../../commun/shared-service';


@Component({
    selector: 'app-modal-confirm',
    templateUrl: './modal-confirm.component.html',
    styleUrls: ['./modal-confirm.component.css']
})

export class ModalConfirmComponent implements OnInit {
   public confirmTitle: string;
   public confirmMessage: string;

   model: any = {};

    /* @Input() title : string;
   @Input() message : string;  */

   @Output() out = new EventEmitter<any>();
  constructor(
    public bsModalRef: BsModalRef,
    private sharedService: SharedService,
    private changeDetector: ChangeDetectorRef
    //,private modalService: BsModalService
  ) { 
    this.sharedService.closeAllModal.subscribe(data => {
        if (data) {
            this.bsModalRef.hide();
        }
    });
  }

  /* public openModalWithComponent() {
    this.bsModalRef = this.modalService.show(ConfirmDialogComponent);
  } */
  ngOnInit() {
    console.log('this.content');
    /* this.confirmTitle = this.title;
    this.confirmMessage = this.content; */
    //showDeleteSite(ModalSmall)
  }

  onDeleteConfirm(modal) {
    let dataOut = {};

    if (this.model.isBlackListModal) {
      dataOut = {
        data: true,
        isBlackListed : this.model.isBlackListed,
        uid : this.model.uid
      };
    } else {
      dataOut = {
        data: true
      };
    }
    this.out.emit(dataOut);
    modal.hide();
      //bsModalRef.hide()
  }

  afterModelLoad(): void {
    this.confirmTitle = this.model.title;
    this.confirmMessage = this.model.content;
    this.changeDetector.detectChanges();
    //console.log("after refresh");
  }
  
  onDeleteCancel(modal){
      this.out.emit({
        data: false
      });
      modal.hide();
  }

}
