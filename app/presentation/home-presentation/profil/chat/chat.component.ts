import { Component, OnInit, Inject,  Output, EventEmitter } from '@angular/core';

import { Contact, Room, Message, MessageQueue, mockContacts, mockMessages } from '../../../../donnee/chat';

import { CryptionAesService } from '../../../../commun/cryption-aes.service';

import { SharedDataService } from '../../../../presentation/shared/service/shared-data.service';

import { environment } from '../../../../../environments/environment';

import { TruncatePipe } from '../../../../presentation/shared/shared-pipe/truncate.pipe';
import { HomeApplicatifServiceACI } from '../../../../service/applicatif/home';


import { 
  //ChatService, 
  ChatMucService 
} from '../../../../commun';

import {MdDialog, MdDialogRef, MD_DIALOG_DATA} from '@angular/material';
import { Router, ActivatedRoute } from '@angular/router';

/* declare const Strophe;
declare const $pres;
declare const $msg;

declare const RSM;
declare const $;
declare const $iq; */

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit {

    userDetailId: string
    @Output() selectContactEvent = new EventEmitter();
  constructor(
    /* private router: Router, */
    private activatedRoute: ActivatedRoute
   /*  private cryptionAesService: CryptionAesService,

    private chatMucService: ChatMucService,
    public dialog: MdDialog,
    public homeApplicatifServiceACI: HomeApplicatifServiceACI,    private sharedDataService: SharedDataService */
  ) {
    
  } 

  // 

  onContactSelected (selectedContact) {
    console.log('selectedContact 1', selectedContact);
    this.selectContactEvent.emit(selectedContact);
  }

  ngOnInit() {
    this.takeRouteParams();
  }

  takeRouteParams() {
    this.userDetailId =  this.activatedRoute.snapshot.params['id'];
    this.activatedRoute.params.subscribe(params => {
      if (params['id']){
        this.userDetailId = params['id'];
      }
    });
  }

}
