import { Injectable } from '@angular/core';
import { environment } from '../../../../../environments/environment';
import {  TchatService,  ChatMucService } from '../../../../commun';
import { SharedService } from '../../../../commun/shared-service';
import { TchatForbiddenService } from './tchat.forbidden.service';

import * as xml2js from 'xml2js';
import { TranslateService } from 'ng2-translate';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';

import { TchatMessageService } from './tchat.message.service';
import { TchatConnectionService } from './tchat.connection.service';
import { AdministrationApplicatifServiceACI } from '../../../../service/applicatif/administration/administration.applicatif.service.aci';
import { HomeApplicatifServiceACI } from '../../../../service/applicatif/home';

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
export class TchatReceiptService {
    parser: any;
    public tchatsForbidden: any[];
    tchatNotAutorized: string;
    public today: string;
    userAddBlackListMessage = 'Vous ne pouvez plus tchater avec cet utilisateur. Il vous a mis dans sa liste noire.';
    yourAddBlackListMessage = `Vous ne pouvez plus tchater avec cet utilisateur.
    Il est dans votre liste noire. Gérer votre liste noire dans votre profil/options.`;
    constructor(
        private http: Http,
        public tchatMessageService: TchatMessageService,
        public tchatConnectionService: TchatConnectionService,
        private cryptionAesService: CryptionAesService,
        public sharedService: SharedService,
        private chatMucService: ChatMucService,
        public tchatForbiddenService: TchatForbiddenService,
        private administrationApplicatifService: AdministrationApplicatifServiceACI,
        private translate: TranslateService,
        public homeApplicatifServiceACI: HomeApplicatifServiceACI,
    ) {
        this.parser = new xml2js.Parser();
        this.administrationApplicatifService.listTermes().subscribe(termes => {
            this.tchatsForbidden = termes.value.filter(term => term.tchat);
        });
        this.translate.get('tchatNotAutorized').subscribe((res: string) => {
            this.tchatNotAutorized = res;
        });
        this.translate.get('today').subscribe((res: string) => {
            this.today = res;
        });
    }

    public addReceipt(msg, msgId) {
        msg.tree().setAttribute('id', msgId);
        const request = Strophe.xmlElement('request', {'xmlns': Strophe.NS.RECEIPTS});
        msg.tree().appendChild(request);
        return msg;
    }

      public onReceipt (messageXml, contacts, messageQueues, currentLang, userUid, today, daysAgo, connection) {
        // Always use arrow function when it's a callback function so the context of '.this' doesn't change.
        this.processReceipt(messageXml, contacts, messageQueues, currentLang, userUid, today, daysAgo, connection);
        return true;    // Always return true to not detach the handler
    }

    /* getUidFromString(from) {
        let ressouceUid = Strophe.getResourceFromJid(from);
        ressouceUid = ressouceUid.length > 0 ? ressouceUid : from;
        let contactFromUid = ressouceUid;


        return contactFromUid;
    } */

    public setMessageStatusToSent(rec, to: string, userUid,
        messageQueues, contacts, currentLang, today, daysAgo, contact) {
            const recvId = rec[0].getAttribute('id');

        const correspondingMessageQueue = messageQueues.find(msgQueue => msgQueue.contactJid === contact.jid);
        if (correspondingMessageQueue) {
            const message = correspondingMessageQueue.messages.find(mess => mess.id === recvId);
            if (message) {
                message.status = 'SENT';      // On delivery receipt, change status from 'PENDING' to 'SENT'
            }
        }




        /*
        if (contact) {
          contact.currentMessageTimestamp = message.timestamp;
          contact.currentMessageContent = message.body;
          contact.currentMessageRelativeDate =
            this.chatMucService.getRelativeDay(message.timestamp, currentLang, today, daysAgo);
        } */
    }
    public processReceipt(msg, contacts, messageQueues, currentLang, userUid, today, daysAgo, connection) {
        const from = msg.getAttribute('from');
        const contactResource = Strophe.getResourceFromJid(from);
        const room = Strophe.getBareJidFromJid(from);

        const id = msg.getAttribute('id');
        const to = msg.getAttribute('to');
        const toResource = Strophe.getResourceFromJid(to);

        const req = msg.getElementsByTagName('request');
        const rec = msg.getElementsByTagName('received');

        if (rec.length > 0) { // When a sent message is received
            // console.log('---------------------- on received : to ', to, 'from ', from , msg);
            const contact = contacts.find(c => c.uid === contactResource);
            if (contact && contact.status === 'online') {
                this.setMessageStatusToSent(rec, to, userUid,
                    messageQueues, contacts, currentLang, today, daysAgo, contact);
            }

        } else if (req.length > 0) {
            const contact = contacts.find(c => c.uid === contactResource);
            if (contact && contact.status === 'online') {
              const out = $msg({
                  to: from ,
                  // to:  contact.jid + '/' + contact.uid,
                 from: connection.jid,
                id: connection.getUniqueId() }),
              request = Strophe.xmlElement('received', { 'xmlns': Strophe.NS.RECEIPTS, 'id': id });
              out.tree().appendChild(request);
              connection.send(out);
            }
        }
    }

    sendMessageEngine(typedMessage, currentContact, contacts, connection, userUid): Observable<any> {
      const isInvalidMessage = this.tchatForbiddenService.isMessageExcluded(typedMessage, this.tchatsForbidden);
      let data: any;
      if (isInvalidMessage.excluded) {
        const pluriel = isInvalidMessage.message.length === 1 ? '' : 's';
        const errorMessage =  ` ${this.tchatNotAutorized}. 
        Il contient le${pluriel} mot${pluriel} "${isInvalidMessage.message.map(res => res.value).join('", "')}". `;
        // console.log(isInvalidMessage.message);
            /* const errorMessage =  ` ${this.tchatNotAutorized}. Il contient le mot ${isInvalidMessage.message} `; */
        data = {statut: 'ko', message: errorMessage};

        return  Observable.of<any>(data);
      }
      if (!isInvalidMessage.excluded) {
        const to = currentContact || contacts[0];
        // Verifier si dans blacklist avant d'envoyer le message

       return  this.homeApplicatifServiceACI.checkinBlackList(to.name)
            .map(res => {
              if (res.isBlackList === true || res.isUserAddBlackList) {
                  const errorMessage = res.isUserAddBlackList ? this.userAddBlackListMessage : this.yourAddBlackListMessage;
                  data = {statut: 'ko', message: errorMessage};
                  return data;
              } else {
                    const msgId = connection.getUniqueId('message');
                    let msg = $msg({
                        to: to.roomJid,
                        // type: 'chat'
                        // from : to.roomJid + '/' + this.userUid.toLocaleLowerCase(),
                        type: 'groupchat'
                    });
                    msg.c('body', {
                        xmlns: Strophe.NS.CLIENT
                    }, typedMessage);
                    msg = this.addReceipt(msg, msgId);
                    console.log('***** send message *****', to.roomJid, msg);
                    connection.send(msg);
                    const timestamp = (new Date());
                    // tslint:disable-next-line:max-line-length
                    const message = new Message(msgId, userUid, to.roomJid, 'groupchat', typedMessage, timestamp, this.today || 'today', 'PENDING');
                    data = {statut: 'ok', message: message};
                    return  data;
                }
            }, err => {
                data = {statut: 'ko', message: err};
                return data;
          });
      }
  }

}
