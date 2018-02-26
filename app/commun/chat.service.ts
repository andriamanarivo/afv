import { Injectable } from '@angular/core';


import {
    Contact,
    Message// , MessageQueue, mockContacts, mockMessages
} from '../donnee/chat';

import { environment } from '../../environments/environment';

declare const Strophe;
declare const $pres;
declare const $msg;

declare const RSM;
declare const $;
declare const $iq;

@Injectable()
export class ChatService {

    Connect(username, password, connexionCallback) {
        const boshService = environment.boshService;
        const connection =  new Strophe.Connection(boshService);
        return connection.connect(username, password, (value) =>
            connexionCallback(value , connection)
        );
    }

    public getHistoryMessage = (contactJid: string, connection, userName, onEachHistoryMessageCallback) => {
        console.log('get histroy message for: ', contactJid);
        const param = {
          'with': contactJid,
          onMessage: onEachHistoryMessageCallback,
          // onChatstate: this.onChatstate,
          // onSubscriptionRequest : this.onSubscriptionRequest,
          // onRejectPresenceSubscription: this.onRejectPresenceSubscription,
          // onPresence :this.onPresence,
          onComplete: this.onHistoryMessageComplete,
          max: 20
        };
        connection.mam.query(userName, param);
    }


    public parseHistoryMessageXml(messageXml, userName): Message {
        let id, from, to, body, status;
        const messageTags = messageXml.getElementsByTagName('message');
        console.log('Message tags: ', messageTags);
        id = $(messageXml).find('forwarded message').attr('id');
        from = $(messageXml).find('forwarded message').attr('from');
        from = from.split('/')[0];
        to = $(messageXml).find('forwarded message').attr('to');
        body = $(messageXml).find('forwarded message body').text();
        status = to === userName ? 'RECEIVED' : 'SENT';

        const delay = $(messageXml).find('delay');

        let timestamp = (new Date());
        if (delay.text()) {
          const stamp = delay.attr('stamp');
          timestamp = (new Date(stamp));
          console.log('timestamp : ', timestamp);
        }

        // return new Message(id, from, to, type, body, timestamp,'RECEIVED');
        const mes = new Message(id, from, to, 'chat', body, timestamp, status);
        return mes;
      }

    private onHistoryMessageComplete = (res) => {
      // Always use arrow function when it's a callback function so the context of '.this' doesn't change.
      console.log('Complete history message from an user, res: ', res);
    }

    public getRoster(connection, getRosterCallback, isReloadMessage: boolean = true, jid = null) {
        connection.roster.init(connection);
        connection.roster.get(result => {
          return getRosterCallback(result, isReloadMessage, jid);
        });
    }


    public attachHandlers(connection, onMessageCallback,
        onReceiptCallback, onPresenceCallback, onSubscriptionRequestCallback,
        onRejectPresenceSubscriptionCallback
    ) {
        connection.addHandler(onMessageCallback, null, 'message', 'chat');    // Message handler
        connection.addHandler(onReceiptCallback, Strophe.NS.RECEIPTS, 'message');  // Receipt handler
        // ... Other handler if necessary
        /* this.connection.addHandler(this.onChatstate, Strophe.NS.CHATSTATES, 'message'); */
        connection.addHandler(onPresenceCallback, null, 'presence');
        connection.addHandler(onSubscriptionRequestCallback, null, 'presence', 'subscribe');

        connection.addHandler(onRejectPresenceSubscriptionCallback, null, 'presence', 'unsubscribe');
        // onRejectPresenceSubscription
    }

    public onSubscriptionRequestCallback = (messageXml, connection) => {
        // console.log("onSubscriptionRequest - xml: ", messageXml);
        if (messageXml.getAttribute('type') === 'subscribe'
          // && is_friend(stanza.getAttribute("from"))
        ) {
              // Send a 'subscribed' notification back to accept the incoming
              // subscription request
              let from = messageXml.getAttribute('from');
              from = Strophe.getBareJidFromJid(from);
              connection.send($pres({ to: from, type: 'subscribed' }));
          }
        return true;
      }

      public onRejectPresenceSubscriptionCallback = (messageXml) => {
        // console.log("onRejectPresenceSubscription - xml: ", messageXml);
        if (messageXml.getAttribute('type') === 'unsubscribe') {
          let from = messageXml.getAttribute('from');
          from = Strophe.getBareJidFromJid(from);
        const pres = $pres({ to: from, type: 'unsubscribed' });
        }
      }

    public setPresence(connection) {
        const presence = $pres();
        presence.tree();
        connection.send(presence);
    }

    public parseReceivedMessageXml(messageXml): Message {
        const id = messageXml.getAttribute('id');
        let from = messageXml.getAttribute('from');
        // from = from.split("/")[0];
        from = Strophe.getBareJidFromJid(from);

        const to = messageXml.getAttribute('to');
        const type = messageXml.getAttribute('type');
        const bodyXml = messageXml.getElementsByTagName('body');
        const body = Strophe.getText(bodyXml[0]);
        const delayXml = messageXml.getElementsByTagName('delay');
        let timestamp = (new Date());

        if (delayXml.length > 0) {
          const stamp = delayXml.getAttribute('stamp');
          timestamp = (new Date(stamp));
          // console.log("timestamp : ", timestamp);
        }
        return new Message(id, from, to, type, body, timestamp, 'RECEIVED');
    }

    public getRelativeDay(timestamp) {
        const timeAgoInSeconds = Math.floor((Date.now() - new Date(timestamp).getTime()) / 1000);
        const secondsInAday = 86400;
        const elapse =  Math.round(timeAgoInSeconds / secondsInAday);
        const messageDate =   elapse === 0 ? 'today' : Math.abs(elapse) + ' days ago';
        return messageDate;
    }

    handleChatStateMessage = (messageXml) => {
        const isComposing = messageXml.getElementsByTagName('composing');
        const from  = messageXml.getAttribute('from');
        const resource = Strophe.getResourceFromJid(from);
        if (resource.indexOf('-') >= 0) {
          return Strophe.getBareJidFromJid(from) + ' ' + 'is typing';
        } else {
          return Strophe.getBareJidFromJid(from) + ' ' + 'is typing from another device';
        }
    }
    public getStatus(status) {
        switch (status) {
          case 'away':
              return 'away';
          case 'dnd':
              return 'busy';
            case 'offline':
              return 'offline';
          case 'unavailable':
            return 'unavailable';
          default:
              return 'online';
        }
    }

    /* public processReceipt(msg,connection, setMessageStatusToSentCallback) {
        let isProcessReceipt = false;
        let id = msg.getAttribute('id');
        let from = msg.getAttribute('from');
        let to = msg.getAttribute('from');
        let req = msg.getElementsByTagName('request');
        let rec = msg.getElementsByTagName('received');
        if (rec.length > 0) { // When a sent message is received
          //this.setMessageStatusToSent(rec, to);
          return setMessageStatusToSentCallback(true,rec,to);
        } else if (req.length > 0) {
          let out = $msg({ to: from, from:connection.jid, id: connection.getUniqueId() }),
          request = Strophe.xmlElement('received', { 'xmlns': Strophe.NS.RECEIPTS, 'id': id });
          out.tree().appendChild(request);
          connection.send(out);
          return setMessageStatusToSentCallback(false,rec,to);
        }
      } */

}
