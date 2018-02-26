import { Injectable } from '@angular/core';
import { environment } from '../../../../../environments/environment';
import {  TchatService,  ChatMucService } from '../../../../commun';
import { SharedService } from '../../../../commun/shared-service';

import { Headers, Http, Response, RequestOptions} from '@angular/http';
import { CryptionAesService } from '../../../../commun/cryption-aes.service';
import { Contact, Room, Message, MessageQueue, mockContacts, mockMessages } from '../../../../donnee/chat';

declare const Strophe;
declare const $pres;
declare const $msg;

declare const RSM;
declare const $;
declare const $iq;

@Injectable()
export class TchatPresenceService {
    constructor(
        private http: Http,
        private cryptionAesService: CryptionAesService,
        public sharedService: SharedService,
        private chatMucService: ChatMucService
    ) {

    }

    getUidFromString(from) {
      let ressouceUid = Strophe.getResourceFromJid(from);
      ressouceUid = ressouceUid.length > 0 ? ressouceUid : from;
      const contactFromUid = ressouceUid;
      return contactFromUid;
  }

    onPresenceMucCallback(presence, contacts, userUid, statusChangeCb) {
         /* console.log(presence);
         console.log(userUid);
         console.log(contacts);
         console.log('*************************'); */
        const isPresence = false;
        let presenceType = $(presence).attr('type');
        // console.log("presenceType : ",presenceType);
        const from = $(presence).attr('from');
        // const fromUid = this.getUidFromString(from);

        const fromUid = Strophe.getResourceFromJid(from);

        const to = $(presence).attr('to');
        // const toUid = this.getUidFromString(to);
        const toUid = Strophe.getResourceFromJid(to);

        const contactUid = fromUid === userUid ? toUid : fromUid;
        if (fromUid !== userUid || fromUid !== toUid) {
          if (!presenceType) {
            presenceType = 'online';
          }
          if (presenceType !== 'error') {
            if (presenceType === 'unavailable') {
              // Mark contact as offline
              // console.log('presenceType : ', presenceType);
              presenceType = 'unavailable';
            } else {
              const show = $(presence).find('show').text(); // this is what gives away, dnd, etc.
              if (show === 'chat' || show === '') {
                // Mark contact as online
                // console.log("presenceType show : ",presenceType, " show: ", show);
                presenceType = 'online';
              } else {
                // etc...
                // console.log("presenceType show else : ",presenceType);
                presenceType = 'unavailable';
              }
            }
          }
          if (contactUid) {
            const contact = contacts.find(ct => ct.uid ===  contactUid);
            if (contact) {
              contact.status = presenceType;
              statusChangeCb(contact);
              const cryptedContacts = this.cryptionAesService.cryptMessage(JSON.stringify(contacts));
              sessionStorage.setItem('contact-'  + userUid, cryptedContacts.toString());
            }
          }
        }
        
        return true;
      }
  sendPresenceToRoom(roomJid, userName, connection) {
    const presence = $pres({
      to: roomJid + '/' + userName,
      from : connection.jid,
      type: 'unavailable'
    }).c('x', {
      xmlns: Strophe.NS.MUC
    });
    // presence.tree();
     connection.send(presence.tree());
  }
  clearConnection (connection) {
    if (connection) {
      // connection.sync = true;
      connection.send(
        $pres({type : 'unavailable'})
      );
      // connection.flush();
      connection.disconnect();
      /* if (connection._options && connection._options.sid) {
        connection._options.sid = null;
      } */
      /* connection = null; */
      this.sharedService.setLogout = true;
    }
  }

}
