import {
    Component, OnInit,
    Input, Output, EventEmitter,
    ChangeDetectorRef
} from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';

import { SharedService } from '../../../commun/shared-service';


@Component({
    selector: 'app-tchat-modal',
    templateUrl: './tchat-modal.component.html',
    styleUrls: ['./tchat-modal.component.css']
})
export class TchatModalComponent implements OnInit {
    public confirmTitle: string;
    public confirmMessage: string;
    public userDetailId: string;
    model: any = {};
    @Output() out = new EventEmitter<any>();
    
    constructor(
        private shardeService: SharedService,
        public bsModalRef: BsModalRef,
        private changeDetector: ChangeDetectorRef
    ) {
        this.shardeService.closeAllModal.subscribe(data=>{
            if(data){
                this.bsModalRef.hide();
            }
        });

    }


    ngOnInit() {

    }

    onDeleteConfirm(modal) {
        this.out.emit({
            data: true
        });
        modal.hide()
    }

    afterModelLoad(): void {
        this.confirmTitle = this.model.title;
        this.confirmMessage = this.model.content;
        this.userDetailId = this.model.uid;
        this.changeDetector.detectChanges();
    }

    onDeleteCancel(modal) {
        this.out.emit({
            data: false
        });
        modal.hide()
    }
}
