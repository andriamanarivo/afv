import { Injectable } from '@angular/core';

/*import * as _lodash from 'lodash';

import * as _lodash from 'lodash/unescape'; */

import { Headers, Http, Response, RequestOptions} from '@angular/http';

import { TranslateService } from 'ng2-translate';

import {
    Contact,
    Message// , MessageQueue, mockContacts, mockMessages
} from '../donnee/chat';

import { environment } from '../../environments/environment';
import { SharedService } from './shared-service';

declare const Strophe;
declare const $pres;
declare const $msg;

declare const RSM;
declare const $;
declare const $iq;

@Injectable()
export class ChatMucService {

    public today: string;
    public daysAgo: string;
    public unescapeHtmlChar: any = {
        '&#39;': '\'',
        '&amp;': '&',
        '&apos;': '\'',
        '&gt;': '>',
        '&lt;': '<',
        '&quot;': '"',
    };
    constructor(
        private http: Http,
        public sharedService: SharedService,
        private translate: TranslateService
    ) {
        this.translate.get('today').subscribe((res: string) => {
            this.today = res;
        });
        this.translate.get('daysAgo').subscribe((res: string) => {
            this.daysAgo = res;
        });
    }
    public basePropertyOf(object) {
        return function(key) {
            return object == null ? undefined : object[key];
        };
    }

    public  unescape(string) {
        let _str = '';
        const  reEscapedHtml  = /&(?:amp|lt|gt|quot|#39|apos);/g;
        const unescapeHtmlChar = this.basePropertyOf(this.unescapeHtmlChar);
        const reHasEscapedHtml  = RegExp(reEscapedHtml.source);
        if (string) {
            _str = string;
        }
        string = _str.toString();
        return (string && reHasEscapedHtml.test(string))
            ? string.replace(reEscapedHtml, unescapeHtmlChar)
            : string;
    }
    public messageHasDelay(message): boolean {
        const delay = $(message).find('delay');
        return delay.length > 0 ? true : false;
    }

    searchRoom(search: string, OpenfireApiRest: string) {
        // console.log('********************* search muc : ', search);
        search = search.toLocaleLowerCase();
        const authorization = 'Basic ' + environment.basicAuthorization;
        const headers = new Headers(
            {
            'Content-Type': 'application/json',
            'Authorization': authorization
            });
        const options = new RequestOptions({ headers: headers });
        const roomUrl = OpenfireApiRest + '?type=all&servicename=' + environment.openfireServiceName + '&search=' + search ;
        // console.log('roomUrl : ' + roomUrl);
        return this.http.get(roomUrl, options);
    }

    getUidFromString(from) {
        let ressouceUid = Strophe.getResourceFromJid(from);
        ressouceUid = ressouceUid.length > 0 ? ressouceUid : from;
        let contactFromUid = ressouceUid;

        /* const fromUid = ressouceUid.split('+');
        switch (fromUid.length) {
            case 1:
                contactFromUid = fromUid[0];
                break;
            case 2:
                contactFromUid = fromUid[1];
                break;
        } */
        return contactFromUid;
    }

    public parseMucMessage(message, userUid, contacts): Message {
        // const status;

        const roomNameJid =  Strophe.getBareJidFromJid(message.getAttribute('from'));
        const roomNameSplit = roomNameJid.split('@');
        const roomName = roomNameSplit.length > 0 ? roomNameSplit[0] : roomNameJid;

        const id = message.getAttribute('id');
        let from = message.getAttribute('from');

        const fromSplit = from.split('/');
        const cUid = fromSplit.length > 0 ? fromSplit[0] : from;

        // let contactJid = Strophe.getResourceFromJid(from);

        let contactFromUid = Strophe.getResourceFromJid(from);
        let to = message.getAttribute('to');
        to = Strophe.getBareJidFromJid(to);

        if (contactFromUid) {
            /* const fromUid = contactFromUid.split('+');
            switch (fromUid.length) {
                case 1:
                    contactFromUid = fromUid[0];
                  break;
                case 2:
                    contactFromUid = fromUid[1];
                  break;
            } */

            const contact = contacts.find(ct => ct.uid ===  contactFromUid);
            if (contact) {
                from = contact.uid;
            } else {
                from = null;
            }
        } else {
            if (cUid !== undefined && cUid !== null) {
                const searchIndex = cUid.indexOf(userUid);
                if (searchIndex >= 0) {
                    const contactUid = this.truncateFromString(cUid,
                    searchIndex, searchIndex + userUid.length, userUid, '|');
                    from = contactUid;
                }
            }
        }

        const contact = contacts.find(ct => ct.jid ===  to);
        if (contact) {
            to = contact.uid;
            if (!from) {
                from = userUid;
            }
        } else {
            to = userUid;
            if (!from) {
                if (cUid !== undefined && cUid !== null) {
                    const searchIndex = cUid.indexOf(userUid);
                    if (searchIndex >= 0) {
                        const contactUid = this.getContactFromString(cUid,
                        searchIndex, searchIndex + userUid.length, userUid, '|', 1);
                        from = contactUid;
                    }
                } else {
                    from = userUid;
                }
            }
        }

        const type = message.getAttribute('type');
        const bodyXml = message.getElementsByTagName('body');
        const body = this.unescape(Strophe.getText(bodyXml[0]));
        // let delayXml = message.getElementsByTagName('delay')
        const delay = $(message).find('delay');

        let timestamp = (new Date());
        if (delay.length > 0) {
            const delayFrom = delay.attr('from');
            from = this.getUidFromString(delayFrom);
            const searchIndex = roomName.indexOf(from);
            to = this.truncateFromString(roomName,
                searchIndex, searchIndex + from.length, from, '|');
            const stamp = delay.attr('stamp');
            console.log('stamp : ', stamp);
            timestamp = (new Date(stamp));
          // console.log("timestamp : ", timestamp);
        }
        const mes = new Message(id, from, to, 'chat', body, timestamp,
            this.getRelativeDay(timestamp, this.translate.currentLang, this.today, this.daysAgo),
            status);
            /* console.log(' ----------------------------------- >');
            console.log(message);
            console.log('mes from : ', mes.from, 'mes body : ', mes.body, 'mes to : ', mes.to); */
        // messageDate
        return mes;
    }

    truncateFromString(from, index, length, userName, separator) {
        const roomSplit = from.split('@');
        if (roomSplit.length > 0) {
            from = roomSplit[0];
        }

        // openfire converti auto en minuscule
        userName = userName.toLocaleLowerCase();

        const from1 = from.split(separator)[0];
        const from2 = from.split(separator)[1];
        if (from1 === userName) {
          return from2;
        } else  if (from2 === userName) {
          return from1;
        } else {
          return '';
        }
      }

      getContactFromString(from, index, length, userName, separator, isConnectedDefault) {
        const roomSplit = from.split('@');
        if (roomSplit.length > 0) {
            from = roomSplit[0];
        }
        const from1 = from.split(separator)[0];
        const from2 = from.split(separator)[1];

        // openfire converti auto en minuscule
        userName = userName.toLocaleLowerCase();

        if (from1 === userName) {
          return from1;
        } else  if (from2 === userName) {
          return from2;
        } else {
          return  '';
        }
      }
    logout () {
        this.sharedService.setActivateIdle = false;
        sessionStorage.removeItem('allUnreadMessageCount');
        sessionStorage.removeItem('ctJid');
        sessionStorage.removeItem('rfIl');
        sessionStorage.removeItem('rfIp');
        sessionStorage.removeItem('id_token');
        sessionStorage.removeItem('rfIuid');
        sessionStorage.removeItem('selectedContactUid');

        this.sharedService.setLogout = true;
    }

    // getRelativeDay(timestamp, loc = 'fr'){
    getRelativeDay(timestamp, loc = 'fr', today , daysAgo ) {

        // loc = this.translate.currentLang;
        // console.log(this.translate.currentLang);
        const timeAgoInSeconds = Math.floor((Date.now() - new Date(timestamp).getTime()) / 1000);
        const secondsInAday = 86400;
        const elapse =  Math.round(timeAgoInSeconds / secondsInAday);
        // let loc = local ? local : this.translate.currentLang;
        // let loc = 'fr';

        daysAgo = daysAgo.replace('{nbDay}', Math.abs(elapse).toString());
        daysAgo = elapse > 1 ? daysAgo.replace('{manyDay}', 's') : daysAgo.replace('{manyDay}', '');

        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour12 : true };
        const messageDate =   elapse === 0 ? today : elapse > 3 ?
            new Date(timestamp).toLocaleDateString(loc, options).toString() : daysAgo;
        return messageDate;
    }
    attachHandlers(connection,
        onMessageCallback
        , onPresenceCallback
        , onReceipt
    ) {
        // console.log('attachHandlers');
        /* connection.addHandler(onMessageCallback, null, 'message', null, null, null); */
        /* connection.addHandler(onMessageCallback, null, 'message', 'chat'); */
        connection.addHandler(onMessageCallback, null, 'message', 'groupchat');
        connection.addHandler(onReceipt, Strophe.NS.RECEIPTS, 'message');  // Receipt handler
        connection.addHandler(onPresenceCallback, null, 'presence');
        return connection;
    }

    disconnect (connection, isLogout) {
        if (isLogout) {
            connection.disconnect();
        }

    }

    leave (connection, room, nick, password) {
        connection.muc.leave(room, nick
        );
    }

    setRoomTopic(roomJID, connection, topic) {
        console.log(' ------------------ setRoomTopic ' + roomJID);
        if (roomJID) {
            connection.muc.setTopic(roomJID, topic);
        }

    }

    createRoom(roomJID, pseudo, connection) {
        console.log('create room ' + roomJID);
        return new Promise((resolve, reject) => {
            if (roomJID) {
                const nick = pseudo;
                const pres = $pres({
                  to: roomJID + '/' + nick
                  // to: roomJID
                }).c('x', {
                  xmlns: Strophe.NS.MUC
                });

                connection.send(pres);

                return connection.muc.createInstantRoom(roomJID,
                      (result) => this.onCreateRoomSuccess(result, roomJID, connection, resolve),
                      (result) => this.onCreateRoomError(result, reject));
              }
        });
        /* if(roomJID){
          let nick = pseudo;
          let pres = $pres({
            to: roomJID + "/" + nick
          }).c('x', {
            xmlns: Strophe.NS.MUC
          });

          connection.send(pres);

            connection.muc.createInstantRoom(roomJID,
                (result) => this.onCreateRoomSuccess(result,roomJID,connection),
                this.onCreateRoomError);
        } */
    }


    onCreateRoomSuccess = (result, roomJID, connection, resolve) => {
        console.log('Room created : ', roomJID);
        resolve(true);
    }


    onCreateRoomError = (result, reject) => {
        console.log('create Room error : ', result);
        return reject(false);
    }

    configureRoom(roomJID, connection) {
        console.log('configure Room' + roomJID);
        return new Promise((resolve, reject) => {
            return connection.muc.configure(roomJID,
                (result) => this.onConfigureRoomSuccess(result, roomJID, connection, resolve, reject),
                (result) => this.onConfigureRoomError(result, reject));
        });
    }
    onConfigureRoomSuccess = (roomConfig, roomJID, connection, resolve, reject) => {
        console.log('Room config set success : ', roomJID);
        const data = [];
        const roomname = $(roomConfig).find('field[var="muc#roomconfig_roomname"]');
        const membersonly = $(roomConfig).find('field[var="muc#roomconfig_membersonly"]');
        const persistentroom = $(roomConfig).find('field[var="muc#roomconfig_persistentroom"]');
        persistentroom.find('value').text(1);

        data[0] = roomname[0];
        data[1] = membersonly[0];
        data[2] = persistentroom[0];
        // TODO
        resolve({
            isSuccess: true,
            data : data
        });
      }


    onConfigureRoomError = (result, reject) => {
        console.log('Room config error : ', result);
        return reject({
            isSuccess: true,
            data : null
        });
    }

    saveConfigurationRoom(roomJID, data, connection) {
        console.log('save Configuration Room' + roomJID);
        return new Promise((resolve, reject) => {
            return connection.muc.saveConfiguration(roomJID, data,
                (result) => this.onSaveConfigureRoomSuccess(result, resolve),
                (result) => this.onSaveConfigureRoomError(result, reject));
        });
    }
    onSaveConfigureRoomSuccess = (roomConfig, resolve) => {
        console.log('Saving of room config is completed : ', roomConfig);
        return resolve(true);
    }

    onSaveConfigureRoomError = (roomConfig, reject) => {
        console.log('Saving of room config has error : ', roomConfig);
        return reject(false);
    }

    deleteRoom(roomJid, connection, pseudo, password) {
        if (roomJid) {
          this.deleteInstantRoom(roomJid, connection, pseudo, password,
          this.onDeleteRoomSuccess, this.onDeleteRoomError);
        }
    }

    public deleteInstantRoom(room, connection, pseudo, password, onDeleteRoomSuccess, onDeleteRoomError) {

            connection.muc.join(room,  pseudo,
              null,
              null,
              password,
              {
                maxstanzas: 20//
                , seconds: 3600
              }
            );
            // room = 'test3';
             const roomiq = $iq({
               to: room,
               // id:'test3',
               // from : this.userName,
               // from : room + "/userh2",
               type: 'set'
             })
             .c('query', { xmlns: Strophe.NS.MUC_OWNER })
             .c('destroy').c('reason').t('Sorry, this room was removed')
             .c('x', { xmlns: 'jabber:x:data', type: 'submit' });
             connection.sendIQ(roomiq.tree(), onDeleteRoomSuccess, onDeleteRoomError);
          }
    onDeleteRoomSuccess = (result) => {
        console.log('onDeleteRoomSuccess : ', result);
      }

      onDeleteRoomError = (result) => {
        console.log('onDeleteRoomError : ', result);
      }

    public sortContacts(contacts, args: string) {
        if (!Array.isArray(contacts) || (Array.isArray(contacts) && contacts.length <= 1)) {
            return contacts;
        }
        if (contacts == null) {
            return null;
        }
        const order = args.substr(0, 1) === '-' ? -1 : 1;
        if (!args || args === '-' || args === '+') {
            return order === 1 ? contacts.sort() : contacts.sort().reverse();
        } else {
            const property: string = args.substr(0, 1) === '+' || args.substr(0, 1) === '-'
            ? args.substr(1) : args;
            contacts.sort((contact1: any, contact2: any) => {
                if (contact1['unreadMessageCount'] < contact2['unreadMessageCount'] ) {
                    return -1 * order;
                } else if ( contact1['unreadMessageCount'] > contact2['unreadMessageCount']) {
                    return 1 * order;
                } else {
                    // return 0;

                    const left = contact1['currentMessageTimestamp'] ? Number(new Date(contact1['currentMessageTimestamp']).getTime()) : 0;
                    const right = contact2['currentMessageTimestamp'] ? Number(new Date(contact2['currentMessageTimestamp']).getTime()) : 0;
                    // return  right - left;
                    if (left < right ) {
                        return -1 * order;
                    } else if ( left > right) {
                        return 1 * order;
                    } else {
                        // jid
                        if (contact1['jid'] < contact2['jid'] ) {
                            return -1 * order;
                        } else if ( contact1['jid'] > contact2['jid']) {
                            return 1 * order;
                        } else {
                            // console.log(" jid 1: ", contact1['jid'])
                            return 0;

                        }

                    }
                }



                /*console.log(contact1['currentMessageTimestamp']," 2",
                 contact2['currentMessageTimestamp']," -left ", left, " - right ", right
                )*/

            });
            return contacts;
        }
    }
}

