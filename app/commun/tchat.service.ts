import { Injectable } from '@angular/core';


import {
    Contact,
    Message
} from '../donnee/chat';

import { environment } from '../../environments/environment';
import { AuthenticationApplicatifService } from '../service/applicatif/authentication';

import { CryptionAesService } from '../commun/cryption-aes.service';

import { HomeApplicatifServiceACI } from '../service/applicatif/home';
import { PhotoPdp } from './photo.pdp';


declare const Strophe;
declare const $pres;
declare const $msg;

declare const RSM;
declare const $;
declare const $iq;

@Injectable()
export class TchatService {
    constructor(
        private authApplicatifService: AuthenticationApplicatifService,
        public homeApplicatifServiceACI: HomeApplicatifServiceACI,
        private photoPdp: PhotoPdp,
        private cryptionAesService: CryptionAesService
    ) {

    }

    public filterContacts(contacts: Contact[], searchTerm: string) {
        searchTerm = searchTerm || '';
        searchTerm = searchTerm.toLowerCase();
        if (searchTerm) {
            contacts = contacts.filter(contact => {
                return contact.name.toLowerCase().indexOf(searchTerm) >= 0;
            });
        }
        return contacts;
    }

    needReconnection() {
        const isLogged = this.authApplicatifService.islogged();
        const waitingLogout = sessionStorage.getItem('waitingLogout');
        let needReconnect = true;
        if (waitingLogout !== null && waitingLogout === '1' ) {
          needReconnect = false;
        }

        if (isLogged ) {
          if (isLogged && needReconnect) {
            return true;
          }
        }
        return false;
      }

    setRidSession(connection) {
        if (connection && connection._proto) {
            sessionStorage.setItem('bosh.rid', connection._proto.rid);
            sessionStorage.setItem('bosh.sid', connection._proto.sid);
            sessionStorage.setItem('bosh.jid', connection.jid);
        }
    }

    pushContact(contactName, roomJid, uid, pdp, contacts) {
      // const contactJid = contactName.length === 0 ? '' : contactName + '@' + environment.openfireServer;
      const contactJid = uid + '@' + environment.openfireServer;
      const contact  = new Contact(contactJid, contactName, uid, pdp, roomJid,
        0, status.length === 0 ? 'offline' : status , null);
      // problème casse avec openfire rooms
      const existContact = contacts.find(ct => ct.uid.toLocaleLowerCase() === contact.uid);

      // console.log('pushContact - contacts : ', contacts, ' uid : ', uid, ' existContact : ', existContact);
      if (!existContact) {
        contacts.push(contact);
      }
    }

    parsePresence(presence, from, to, contacts) {
        // console.log("parsePresence : ", presence);
        if ($(presence).attr('type') !== 'unavailable' && $(presence).attr('type') !== 'error') {
        const show = $(presence).find('show');
        let status = 'online';
        if (show.length !== 0) {
            status = Strophe.getText(show);
        }
        let text = $(presence).find('status');


        if (text.length > 0) {
            text = Strophe.getText(text);
        }
        const contact = contacts.find(ct => ct.jid ===  Strophe.getBareJidFromJid(from));
        if (contact) {
            contact.status = status;
        }
        }
    }

    truncateString(from, index, length) {
      if (from.length === length) {
        return from.substring(0, index - 1);
      } else {
        return from.substring(length + 1 );
      }
    }

    onsearchRoomSuccess (result, userDetail, userDetailId, currentUser ) {

        return new Promise((resolve, reject) => {
          const items = result.json().chatRoom;
          if ((userDetail && currentUser.uid !== userDetail.id) || userDetail === undefined) {
            let roomJid = '';
            let roomName1 = '';
            let roomName2 = '';
            let newRoom = false;
            if (userDetailId !== undefined && userDetail !== undefined) {
              if (userDetail.id === undefined || userDetail.id === null) {
                newRoom = false;
                console.log(' *********** userDetail undefined or null ***************');
              } else {
                roomJid = currentUser.uid + '|' + userDetail.id + '@' + environment.openfireConference;
                roomName1 = currentUser.uid + '|' + userDetail.id;
                roomName2 = userDetail.id + '|' + currentUser.uid;
              }
            }

            if (items === undefined) {
                // this.chatMucService.createRoom(roomJid,this.currentUser.username,this.connection);
                newRoom = true;
                // tslint:disable-next-line:max-line-length
                if (userDetail === undefined || (userDetail && (userDetail.id === undefined || userDetail.id === null))) {
                  newRoom = false;
                  console.log(' *********** userDetail undefined or null ***************');
                }
            } else {
              // console.log("items : length ", items.length, " item ", items);
              let existRoom = undefined;
              if (userDetailId !== undefined && userDetail !== undefined) {
                if (Array.isArray(items)) {
                  existRoom = items.find(room => (room.roomName.toLocaleLowerCase() === roomName1.toLocaleLowerCase()
                    || room.roomName.toLocaleLowerCase() === roomName2.toLocaleLowerCase()));
                } else {
                  existRoom = items.roomName.toLocaleLowerCase() === roomName1.toLocaleLowerCase()
                    || items.roomName.toLocaleLowerCase() === roomName2.toLocaleLowerCase();
                }
              } else {
                existRoom  = true;
                if (Array.isArray(items)) {
                  roomJid = items[0].roomName ;
                } else {
                  roomJid = items.roomName ;
                }
              }

              if (!existRoom) {
                newRoom = true;
                if (!userDetail.id === undefined || userDetail.id === null) {
                  newRoom = false;
                }
                  // this.chatMucService.createRoom(roomJid,this.currentUser.username,this.connection);
              } /* else{
                this.chatMucService.setRoomTopic(roomJid,this.connection,roomJid);
              } */
            }

            resolve({
              isNewRoom : newRoom,
              roomJid: roomJid,
              pseudo : currentUser.uid
            });
          } else {
            reject('même pseudo');
          }
        });
    }

    getContactsPdp(contacts, showConversation) {
        return new Promise((resolve, reject) => {
          // console.log('************** getContactsPdp' , contacts);
          if (contacts.length > 0) {
            const uids = contacts.map(({ uid }) => uid);
            this.homeApplicatifServiceACI.getUserPdpPseudos(uids)
                .subscribe(result => {
                  if (result && result.value) {
                    // console.log('---- result : ', result.value, ' contacts : ', contacts);
                    const res = contacts.reduce((prev, curr) => {
                      const findItem = result.value.
                        find(item => (item.uid && item.uid.toLocaleLowerCase() === curr.uid.toLocaleLowerCase()));
                      // console.log('findItem : ', findItem , ' curr: ' , curr);
                      if (findItem) {
                          if (!findItem.photoProfile) {
                          if (!findItem.vsetes) {
                            curr.defaultpdp = 'assets/img/profil-default.png';
                          }  else {
                            const profilePhoto = this.photoPdp.getPhotoPdp(findItem.vsetes);
                            if (profilePhoto) {
                              curr.defaultpdp = profilePhoto.pdp;
                            }  else {
                              curr.defaultpdp = 'assets/img/profil-default.png';
                            }
                          }

                        } else {
                          findItem.photoProfile = findItem.photoProfile.replace('/var/www/back/app/../data/', 'assets/file_uploaded/');
                          curr.pdp = (showConversation && showConversation) ? findItem.photoProfile :
                          findItem.photoProfile.replace('file_uploaded/', 'file_uploaded/square_320_');
                        }
                        curr.name = findItem.pseudo;
                        curr.jid = findItem.uid + '@' + environment.openfireServer;
                        curr.uid = findItem.uid.toLowerCase();
                        curr.vEtes = findItem.vEtes;
                      }
                      if (curr.uid) {
                        prev.push(curr);
                      }
                      return prev;
                    }, []);
                    // console.log('------------',res);
                    resolve(res);
                  } else {
                    resolve(contacts);
                  }

                }, err => {
                  console.log(err);
                  resolve(contacts);
              });
          } else {
            resolve(contacts);
          }


        });

    }

}
