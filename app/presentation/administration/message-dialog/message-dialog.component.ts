import { Component, OnInit, 
  Input, Output, EventEmitter,
  ChangeDetectorRef } from '@angular/core';
import { BsModalRef, BsModalService  } from 'ngx-bootstrap/modal';
import { SharedService } from '../../../commun/shared-service';


@Component({
  selector: 'app-message-dialog',
  templateUrl: './message-dialog.component.html',
  styleUrls: ['./message-dialog.component.css']
})
export class MessageDialogComponent implements OnInit {

  public messageTitle : string;
   public message : string;

   model: any = {};

    /* @Input() title : string;
   @Input() message : string;  */

   @Output() out = new EventEmitter<any>();
  constructor(
    public bsModalRef : BsModalRef,
    private changeDetector : ChangeDetectorRef,
    private sharedService: SharedService
  ) { 
    this.sharedService.closeAllModal.subscribe(data => {
        if (data) {
            this.bsModalRef.hide();
        }
    });
  }

  ngOnInit() {
    console.log("this.content");
  }

  onDeleteConfirm(modal){
      this.out.emit({
        data: true
      });
      modal.hide()
      //bsModalRef.hide()
  }

  afterModelLoad(): void {
    this.messageTitle = this.model.title;
    this.message = this.model.content;
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
