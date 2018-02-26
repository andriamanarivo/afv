import { Injectable } from '@angular/core';
import { environment } from '../../../../../environments/environment';
import {  TchatService,  ChatMucService } from '../../../../commun';
import { SharedService } from '../../../../commun/shared-service';

import { Headers, Http, Response, RequestOptions} from '@angular/http';
import { CryptionAesService } from '../../../../commun/cryption-aes.service';
import { Contact, Room, Message, MessageQueue, mockContacts, mockMessages } from '../../../../donnee/chat';
import { TranslateService } from 'ng2-translate';

declare const Strophe;
declare const $pres;
declare const $msg;

declare const RSM;
declare const $;
declare const $iq;

@Injectable()
export class TchatMessageService {
  public today: string;
    public daysAgo: string;
    currentUser: any;
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
        private cryptionAesService: CryptionAesService,
        public sharedService: SharedService,
        private chatMucService: ChatMucService,
        private translate: TranslateService,
    ) {
      this.translate.get('today').subscribe((res: string) => {
        this.today = res;
      });
      this.translate.get('daysAgo').subscribe((res: string) => {
          this.daysAgo = res;
      });
    }

    /* public setMessageStatusToSent(rec, to: string, userUid,
        messageQueues, contacts, currentLang, today, daysAgo, contact) {
        const recvId = rec[0].getAttribute('id');
        let messageTo = to;
        to = to.split('/')[0];
          const toSplit = to.split('@')[0];
          const searchIndex = toSplit.indexOf(userUid);
        
        const correspondingMessageQueue = messageQueues.find(msgQueue => msgQueue.contactJid === contact.jid);
        const message = correspondingMessageQueue.messages.find(mess => mess.id === recvId);
        message.status = 'SENT';      // On delivery receipt, change status from 'PENDING' to 'SENT'

        if (contact) {
          contact.currentMessageTimestamp = message.timestamp;
          contact.currentMessageContent = message.body;
          contact.currentMessageRelativeDate =
            this.chatMucService.getRelativeDay(message.timestamp, currentLang, today, daysAgo);
        }
    } */

    truncateFromString(from, index, length, userName, separator) {
        const from1 = from.split(separator)[0];
        const from2 = from.split(separator)[1];
        // openfire converti auto en minuscule
        userName = userName.toLocaleLowerCase();
        if (from1 === userName) {
          return from2;
        } else  if (from2 === userName) {
          return from1;
        } else {
          return '';
        }
      }

      perday(messages, currentLang, today, daysAgo) {
        let currentMessage = null;
        const messageDate = this.chatMucService.getRelativeDay(messages[0].timestamp, currentLang, today, daysAgo);
        if ( messages.length  > 0) {
          currentMessage = {
            body : messages[0].body,
            timestamp : messages[0].timestamp,
            messageDate : messageDate
          };
        }
        return currentMessage;
      }

    searchRooms(search: string) {
        search = search.toLocaleLowerCase();
        // console.log('********************* search not muc : ', search);
        const OpenfireApiRest = environment.OpenfireChatApiRest + 'chatrooms';
        const authorization = 'Basic ' + environment.basicAuthorization;
        const headers = new Headers(
        {
          'Content-Type': 'application/json',
          'Authorization': authorization
        });
        const options = new RequestOptions({ headers: headers });
        const roomUrl = OpenfireApiRest + '?type=all&servicename=' + environment.openfireServiceName + '&search=' + search ;
        // console.log('roomUrl1 : ' + roomUrl);
        return this.http.get(roomUrl, options);
    }
    setOptions(options?: RequestOptions): RequestOptions {
        let opt;
        const authorization = 'Basic ' + environment.basicAuthorization;
        if (options) {
            if (!options.headers.has('Authorization')){
                options.headers.append('Authorization', authorization);
            }
            opt = options;
        } else {
            const header = new Headers({ 'Authorization': authorization });
            opt = new RequestOptions({ headers: header });
        }
        return opt;
    }
    public updateUnreadMessageCounter(senderUid: string, selectedContact, contacts, userUid, messageHeaderCount, receiverUid: string) {
        // console.log(' ----------------------------- senderUid - ', senderUid);
        if ((selectedContact && senderUid !== selectedContact.uid) || !selectedContact) {
          // console.log('****************** senderUid - ', senderUid);
          // const contactUid = senderUid === userUid ? selectedContact.uid : senderUid;
          const contact = contacts.find(ct => ct.uid === senderUid);
          if (contact) {
            contact.unreadMessageCount++;
            // console.log("****************** contact :  jid - ", contact.jid, " - count ", contact.unreadMessageCount);
            const cryptedContacts =  this.cryptionAesService.cryptMessage(JSON.stringify(contacts));
            sessionStorage.setItem('contact-' + userUid, cryptedContacts.toString());

            return messageHeaderCount.allUnreadMessageCount++;
          }

        }
        return messageHeaderCount.allUnreadMessageCount;
    }

      handleChatStateMessage (messageXml, currentContact) {
        const isComposing = messageXml.getElementsByTagName('composing');
        if (isComposing.length > 0) {
          // this.contactIsTyping = true;
          currentContact.isTyping = true;
        }
      }

      needUpdateLastDateSession() {
        const needUpdateDate = true;
        /* if(this.showTchat !== undefined && !this.showTchat) {
          needUpdateDate = false;
        }
        if(this.showConversation !== undefined && !this.showConversation) {
          needUpdateDate = false;
        } */
        return needUpdateDate;
      }
  public pushToMessageQueue(
    message: Message,
    newMessage, userUid,
    messageQueues,
    contacts, currentLang, today, daysAgo, selectedContact, messageHeaderCount,
    needSelectedContact, contactUid
  ) {
      const contact = contacts.find(c => c.uid === contactUid);
      if (contact) {
        const correspondingMessageQueue = messageQueues.find(msgQueue => msgQueue.contactJid === contact.jid)
          || messageQueues.find(msgQueue => msgQueue.contactJid === message.to);
        const existMessage = correspondingMessageQueue.messages.find(msgQueue => msgQueue.id === message.id);
      
        if (newMessage) {
          const selectedContactUid = sessionStorage.getItem('selectedContactUid');
          // if (!existMessage && ((selectedContact && selectedContact.uid !== message.from) || !selectedContact)) {
            if (!existMessage &&
              ((selectedContactUid && selectedContactUid !== message.from && userUid !== message.from) 
                || !selectedContactUid)) {
              if (!messageHeaderCount.allUnreadMessageCount) {
                  messageHeaderCount.allUnreadMessageCount = 0;
              }
              let needCount = true;
              /* console.log(' updateUnreadMessageCounter : message.from', message.from,
                ' message.to : ', message.to, ' message.body : ', message.body, ' current ', needSelectedContact); */
                if (!selectedContact && needSelectedContact) {
                  needCount = false;
                }
                if (needCount) {
                  this.updateUnreadMessageCounter(message.from,
                    selectedContact, contacts, userUid, messageHeaderCount, message.to);
                  this.emitMessageCount(messageHeaderCount.allUnreadMessageCount);
                }
          }
        }
        if (!existMessage) {
            contact.currentMessageTimestamp = message.timestamp;
            contact.currentMessageContent = message.body;
            contact.currentMessageRelativeDate =
              this.chatMucService.getRelativeDay(message.timestamp, currentLang, today, daysAgo);
    
            const cryptedContacts =  this.cryptionAesService.cryptMessage(JSON.stringify(contacts));
            sessionStorage.setItem('contact-' + userUid, cryptedContacts.toString());
    
          if (message.from !== userUid && ( selectedContact || (!selectedContact && needSelectedContact))) {
            message.status = ' ';
          }
          correspondingMessageQueue.messages.push(message);
          // console.log('correspondingMessageQueue', correspondingMessageQueue,'msg', messageQueues);
        }
      }

    /* const messageFrom = message.from;
    const contactUid = message.from === userUid ? message.to : message.from;
    
    const contact = contacts.find(c => c.uid.toLocaleLowerCase() === contactUid.toLocaleLowerCase());

    const correspondingMessageQueue = messageQueues.find(msgQueue => msgQueue.contactJid === contact.jid)
        || messageQueues.find(msgQueue => msgQueue.contactJid === message.to);
    const existMessage = correspondingMessageQueue.messages.find(msgQueue => msgQueue.id === message.id);
    if (newMessage) {
        if (!existMessage && ((selectedContact && selectedContact.uid !== messageFrom) || !selectedContact)) {
            if (!messageHeaderCount.allUnreadMessageCount) {
                messageHeaderCount.allUnreadMessageCount = 0;
            }
            let needCount = true;
            console.log(' updateUnreadMessageCounter : message.from', message.from,
              ' message.to : ', message.to, ' message.body : ', message.body, ' current ', needSelectedContact);
              if (!selectedContact && needSelectedContact) {
                console.log(' userUid', userUid, ' selectedContact ', selectedContact);
                needCount = false;
              }
              if (needCount) {
                this.updateUnreadMessageCounter(messageFrom,
                  selectedContact, contacts, userUid, messageHeaderCount, message.to);
                this.emitMessageCount(messageHeaderCount.allUnreadMessageCount);
              }
        }
    }

    if (!existMessage) {
      const contact = contacts.find(ct => ct.roomJid ===  Strophe.getBareJidFromJid(roomJid));
      if (contact) {
        contact.currentMessageTimestamp = message.timestamp;
        contact.currentMessageContent = message.body;
        contact.currentMessageRelativeDate =
          this.chatMucService.getRelativeDay(message.timestamp, currentLang, today, daysAgo);

        const cryptedContacts =  this.cryptionAesService.cryptMessage(JSON.stringify(contacts));
        sessionStorage.setItem('contact-' + userUid, cryptedContacts.toString());
      }

      if (message.from !== userUid && ( selectedContact || (!selectedContact && needSelectedContact))) {
        message.status = 'lu';
      }
      correspondingMessageQueue.messages.push(message);
    } else {
      existMessage.status = 'SENT';
    } */
  }

  public emitMessageCount(messageCount: number) {
    sessionStorage.setItem('allUnreadMessageCount', messageCount.toString());
    this.sharedService.setTchatMessageCount = messageCount;
  }
  getContactFromContactJid(contactJid, userUid) {
    const contactSplit = contactJid.split('@');
    const contactRoom =  contactSplit.length > 0 ? contactSplit[0] : contactJid;

    const roomSplit = contactRoom.split('|');
    const contact =  roomSplit.length > 0 ? roomSplit[0] === userUid ? roomSplit[1] : roomSplit[0] : contactJid;
    return contact;
  }
  /* public parseMucMessage(message: any, userUid, contacts) {

    if (message && message.message && message.message.$) {
        const from = message.message.$.from;
        const contactResource = Strophe.getResourceFromJid(from);
        const room = Strophe.getBareJidFromJid(from);
        const id = message.message.$.id;
        const to = message.message.$.to;
        const toResource = Strophe.getResourceFromJid(to);
        const type = message.message.$.type;
        const body = message.message.body[0];
        let hasDelay = false;
        if (message && message.message && message.message.delay && message.message.delay.length > 0 ) {
            const delay = message.message.delay[0];
            const stamp = delay.$.stamp;
            // console.log('stamp', stamp);
            hasDelay = true;
        }

        const timestamp = (new Date());
        const mes = new Message(id, contactResource, toResource, 'chat', body, timestamp,
            ' ',
            status, hasDelay, room);

            return mes;
    }
    return null;
  } */

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
  public basePropertyOf(object) {
    return function(key) {
        return object == null ? undefined : object[key];
    };
  }
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
  public parseMucMessage(message, userUid, contacts): Message {
    const from = message.getAttribute('from');
    const contactResource = Strophe.getResourceFromJid(from);
    const room = Strophe.getBareJidFromJid(from);
    const id = message.getAttribute('id');
    const to = message.getAttribute('to');
    const toResource = Strophe.getResourceFromJid(to);
    const composing = message.getElementsByTagName('composing');
    // console.log(composing);

    let hasDelay = false;
    const type = message.getAttribute('type');
        const bodyXml = message.getElementsByTagName('body');
        const body = this.unescape(Strophe.getText(bodyXml[0]));
        // let delayXml = message.getElementsByTagName('delay')
        const delay = $(message).find('delay');

        let timestamp = (new Date());
        if (delay.length > 0) {
            const delayFrom = delay.attr('from');
            const stamp = delay.attr('stamp');
            // console.log('stamp : ', stamp);
            timestamp = (new Date(stamp));
            hasDelay = true;
          // console.log("timestamp : ", timestamp);
        }
        
      status = composing && composing.length !== 0 ? 'composing' : '' ;
      // console.log(status);
      const mes = new Message(id, contactResource, toResource, 'chat', body, timestamp,
          this.getRelativeDay(timestamp, this.translate.currentLang, this.today, this.daysAgo),
          status, hasDelay, room);
        return mes;
  }  

  onMessageCallbackEngine(message,parsedMessage,userUid,contacts,messageQueues,selectedContact,messageHeaderCount) {
        let newMessage = parsedMessage.hasDelay ? false : true;
        if (parsedMessage.from === userUid) {
            newMessage =  false;
        }
        let contactUid = parsedMessage.from === userUid ? parsedMessage.to : parsedMessage.from;
        const roomUid = parsedMessage.room.replace( '@' + environment.openfireConference, '');
        if (contactUid === userUid) {
            contactUid = parsedMessage.room.replace(userUid, '').replace('|', '').replace('@' + environment.openfireConference, '');
        }
        let saveLastStamp = false;
        const needSelectedContact = sessionStorage.getItem('needSelectedContact');

        // unread message
        const lastMessageDateKey = 'lastMessageTimestamp-' + parsedMessage.room;
        let lastUnreadDateKey = 'lastMessageTimestamp-' + parsedMessage.room;
        if (needSelectedContact !== 'true') {
          lastUnreadDateKey = 'lastMessageTimestamp-' + parsedMessage.room + '-';
        }

        let unreadMessageStamp = null;
        let lastReceivedMessageStamp = sessionStorage.getItem(lastMessageDateKey);
        if (needSelectedContact !== 'true') {
          lastUnreadDateKey = 'lastMessageTimestamp-' + parsedMessage.room + '-';
          unreadMessageStamp = sessionStorage.getItem(lastUnreadDateKey);
          if (lastReceivedMessageStamp && unreadMessageStamp &&
            lastReceivedMessageStamp < unreadMessageStamp) {
              lastReceivedMessageStamp = unreadMessageStamp;
          }
        }
        if (!lastReceivedMessageStamp && !unreadMessageStamp) {
          newMessage = true;
          saveLastStamp = true;
        }
        if (parsedMessage.from === userUid) {
          newMessage =  false;
        }
        const messageStamp = parsedMessage.timestamp.getTime();
        if (!newMessage && lastReceivedMessageStamp) {
          const lastMsgKey = 'lastTimestamp-' + parsedMessage.room;

          const lastMsgValue = sessionStorage.getItem(lastMsgKey);
          if (lastMsgValue) {
            console.log('lastMsgValue : ', lastMsgValue, ' messageStamp', messageStamp);
          }
          if (lastReceivedMessageStamp < messageStamp) {
            newMessage = true;
            saveLastStamp = true;
            // tslint:disable-next-line:radix
            const lastd = new Date(parseInt(lastReceivedMessageStamp));
            const msgd = new Date(messageStamp);
          }
        }

        // console.log('newMessage : ', newMessage, 'contactUid', contactUid, 'useruid', userUid, 'mes------>', parsedMessage);
        this.pushToMessageQueue(parsedMessage, newMessage,
          userUid, messageQueues, contacts, this.translate.currentLang,
          this.today, this.daysAgo, selectedContact, messageHeaderCount
          , needSelectedContact === 'true', contactUid);

          if (saveLastStamp
            && this.needUpdateLastDateSession()
            // && needSelectedContact === 'true'
          ) {
            const lastMessageKey = 'lastMessageTimestamp-' + parsedMessage.room;
            if (needSelectedContact !== 'true') {
              lastUnreadDateKey = 'lastMessageTimestamp-' + parsedMessage.room + '-';
            }
            // console.log(lastMessageKey);
            if (parsedMessage.from !== userUid) {
              if (needSelectedContact !== 'true') {
                lastUnreadDateKey = 'lastMessageTimestamp-' + parsedMessage.room + '-';
                sessionStorage.setItem(lastUnreadDateKey, messageStamp);
              } else {
                sessionStorage.setItem(lastMessageKey, messageStamp);
              }
              const lastMsgKey = 'lastTimestamp-' + parsedMessage.room;
              sessionStorage.setItem(lastMsgKey, parsedMessage.timestamp);
            }
          }
    }

}
