import { Injectable } from '@angular/core';
import { environment } from '../../../../../environments/environment';

import { AuthenticationApplicatifService } from '../../../../service/applicatif/authentication';
import { SharedService } from '../../../../commun/shared-service';
import {  TchatService,  ChatMucService } from '../../../../commun';
import { Router } from '@angular/router';

declare const Strophe;
declare const $pres;
declare const $msg;

declare const RSM;
declare const $;
declare const $iq;

@Injectable()
export class TchatConnectionService {
    constructor(
        private authApplicatifService: AuthenticationApplicatifService,
        private router: Router,
        public sharedService: SharedService,
        private tchatService: TchatService,
        private chatMucService: ChatMucService
    ) {

    }

    getRidSession() {
        const rid = sessionStorage.getItem('bosh.rid');
        const sid = sessionStorage.getItem('bosh.sid');
        const jid = sessionStorage.getItem('bosh.jid');
        // console.log('--------- rid', rid, 'sid',sid, 'jid', jid);
    }
    public onConnectionError(error, userUid, connection) {
        const isLogged = this.authApplicatifService.islogged();

        if (isLogged) {
          switch (error) {
            case 401:
            case 404:
            case 400:
              sessionStorage.setItem('waitingLogout', '1');
              this.sharedService.setChatDisconnection(true);
              sessionStorage.removeItem('contact-' + userUid);
              this.chatMucService.logout();
              this.sharedService.setTchatMessageCount = 0;

              this.sharedService.setOpenfireError = error;
              break;
            default:
              if (this.tchatService.needReconnection()) {
                this.sharedService.setTchatMessageCount = 0;
                // location.reload();
                  return true;
              }
              break;
          }
          for (const sessionKey in sessionStorage) {
            if (sessionStorage.hasOwnProperty(sessionKey) && sessionKey.endsWith('-')) {
              console.log(sessionKey);
              sessionStorage.removeItem(sessionKey);
            }
          }
        }
        return false;
    }
    /* public setPresence(roomName, nick, connection) {
        const presence = $pres({
          to: roomName + '/' + nick
        }).c('x', {
          xmlns: Strophe.NS.MUC
        });
        // let presence = $pres();
        presence.tree();
        connection.send(presence);
    } */

    sendUnavailableForAllRooms(connection, rooms, userName) {
       /* connection.send($pres({type: 'unavailable'})); */
       /* if (rooms) {
        rooms.forEach(room => {
          const presence = $pres({
            to: room.jid + '/' + userName,
            // nickname: this.userName,
            type: 'unavailable'
          }).c('x', {
            xmlns: Strophe.NS.MUC
          });
          connection.send(presence);
        });
       } */
     }


}
