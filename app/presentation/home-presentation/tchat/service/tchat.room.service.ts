import { Injectable } from '@angular/core';
import { environment } from '../../../../../environments/environment';
import {  TchatService,  ChatMucService } from '../../../../commun';
import { SharedService } from '../../../../commun/shared-service';

import { TchatMessageService } from './tchat.message.service';
import { TchatConnectionService } from './tchat.connection.service';

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
export class TchatRoomService {
    constructor(
        public tchatMessageService: TchatMessageService,
        public tchatConnectionService: TchatConnectionService
    ) {

    }

    /* listRoomsSuccessCallback(items, rooms, userName, connection, contacts) {
        for (let i = 0, len = items.length; i < len; i++) {
            const existRoom = rooms.find(room => room.jid === items[i].getAttribute('jid'));
            if (!existRoom) {

              const roomJid = items[i].getAttribute('jid');
              const roomName = items[i].getAttribute('name');
              rooms.push(new Room(roomJid, roomName));
              let contactName = roomJid;
              // send presence
              this.tchatConnectionService.setPresence(roomJid, userName, connection);
              const roomSplit = roomJid.split('@')[0];
              const searchIndex = roomSplit.indexOf(userName);
              if (searchIndex >= 0) {
                contactName  = this.tchatMessageService
                  .truncateFromString(roomSplit, searchIndex, searchIndex + userName.length, userName, '|');

                const contact  = new Contact(contactName + '@' + environment.openfireServer,
                  contactName,
                  '',
                  '',
                  roomJid,
                0, status, null, null, null, null, null, false);
                const existContact = contacts.find(ct => ct.jid === contact.jid);
                if (!existContact) {
                  contacts.push(contact);
                }
              }
            }
          }
    } */
}
