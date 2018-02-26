import { Component, OnInit, 
  Input, Output, EventEmitter,
  ChangeDetectorRef } from '@angular/core';
import { BsModalRef, BsModalService  } from 'ngx-bootstrap/modal';
import { SharedService } from '../../../commun/shared-service';


@Component({
  selector: 'app-confirm-dialog',
  templateUrl: './confirm-dialog.component.html',
  styleUrls: ['./confirm-dialog.component.css']
})
export class ConfirmDialogComponent implements OnInit {
   public confirmTitle : string;
   public confirmMessage : string;

   model: any = {};

    /* @Input() title : string;
   @Input() message : string;  */

   @Output() out = new EventEmitter<any>();
  constructor(
    public bsModalRef : BsModalRef,
    private changeDetector : ChangeDetectorRef,
    private sharedService: SharedService
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
    console.log("this.content");
    /* this.confirmTitle = this.title;
    this.confirmMessage = this.content; */
    //showDeleteSite(ModalSmall)
  }

  onDeleteConfirm(modal){
      this.out.emit({
        data: true
      });
      modal.hide()
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
      modal.hide()
  }

}
