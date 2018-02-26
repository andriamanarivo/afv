import { Component, OnInit, Inject , Input, NgZone,
  ViewChild, ElementRef, Output,
  OnChanges, SimpleChange, ChangeDetectorRef, EventEmitter  } from '@angular/core';

import { Headers, Http, Response, RequestOptions} from '@angular/http';

import { Contact, Room, Message, MessageQueue, mockContacts, mockMessages } from '../../../donnee/chat';

import { CryptionAesService } from '../../../commun/cryption-aes.service';
import { SharedService } from '../../../commun/shared-service';

import { SharedDataService } from '../../../presentation/shared/service/shared-data.service';

import { environment } from '../../../../environments/environment';

import { TruncatePipe } from '../../../presentation/shared/shared-pipe/truncate.pipe';
import { HomeApplicatifServiceACI } from '../../../service/applicatif/home';

import {Message as MessagePrimeNg} from 'primeng/primeng';
import { MessageService } from 'primeng/components/common/messageservice';

import {  TchatService,  ChatMucService } from '../../../commun';
import { ModalReportabusComponent } from './modal/modal-reportabus.component';
import { ConfirmMessageComponent } from './confirm.message.component';


import {MdDialog, MdDialogRef, MD_DIALOG_DATA} from '@angular/material';
import { Router } from '@angular/router';

import { tokenNotExpired, JwtHelper } from 'angular2-jwt';

import { SessionStorage, SessionStorageService } from 'ngx-webstorage';

import { PagerService } from '../../../service/pager.service';
import { TranslateService } from 'ng2-translate';

import { AuthenticationApplicatifService } from '../../../service/applicatif/authentication';
import { AutorisationService } from '../../../commun/autorisation.service';
import { MalihuScrollbarService } from 'ngx-malihu-scrollbar';

import { PhotoPdp } from '../../../commun/photo.pdp';

import { AdministrationApplicatifServiceACI } from '../../../service/applicatif/administration/administration.applicatif.service.aci';
import { TchatForbiddenService } from './service/tchat.forbidden.service';
import { TchatMessageService } from './service/tchat.message.service';
import { TchatConnectionService } from './service/tchat.connection.service';
import { TchatPresenceService } from './service/tchat.presence.service';
import { TchatRoomService } from './service/tchat.room.service';
import { TchatReceiptService } from './service/tchat.receipt.service';

import * as xml2js from 'xml2js';
/* import { truncate } from 'fs'; */

// import { EventEmitter } from 'events';

declare const Strophe;
declare const $pres;
declare const $msg;

declare const RSM;
declare const $;
declare const $iq;

@Component({
    // tslint:disable-next-line:use-host-property-decorator
    host: {
        '(document:click)': 'onClick($event)',
    },
    selector: 'app-tchat',
    templateUrl: './tchat.component.html',
    styleUrls: ['./tchat.component.css'],
    providers: [MessageService]
})
export class TchatComponent implements OnInit , OnChanges  {
  parser: any;
  @ViewChild('loaderRef') loaderEl: ElementRef;
  innerWidth: number;
  public tchatsForbidden: any[];
  tchatNotAutorized: string;
  needTriggerLoader = false;
  innerHeight: number;
  messtchatHeight: number;
  allUnreadMessageCount = 0;

  messageHeaderCount: any= {};
  pager: any = {};
  currentPage = 1;
  pagedItems: any[];
  pagedContacts: any[];
  private allItems: any[];
  totalItems: number;
  nbResults = 0;
  contactsUid = [];
  nbErrors = 0;
  @Input() showConversation: boolean;
  @Input() showList = true;

  @Input() showTchat = true;
  @Input() redirectionUrl: string;
  loading= false;
  onchangeLoading = false;
  msgs: MessagePrimeNg[] = [];
  @Input() userDetailId: any;
  @Input() ctJid: string;
  @Output() onSelectContact = new EventEmitter();

  @Output() selectContactEvent = new EventEmitter();
  public userDetail?: any;
  currentUser: any;
  boshService: string;
  rooms: Room[];
  private connectionStatus: string;
  private connectionStatusChanged = false;
  private waitingconnection: boolean;
  private connection;
  contacts: Contact[];
  messageQueues: MessageQueue[];
  currentContact: Contact;
  selectedContact: Contact;
  currentMessageQueue: MessageQueue = new MessageQueue();
  typedMessage = '';
  typingFrom: string;
  userName: string;
  userUid: string;
  userJid: string;
  password: string;
  userStatus: string;
  typing = false;
  contactSearchTerm = '';
  baseUrl = '';
  currentMessage: any;
  showAction = false;
  noConversation: string;
  noUser: string;
  public today: string;
  public daysAgo: string;
  islogout = false;
  needSelectedContact: boolean;
  contactIsComposing: boolean;
  public autorisation;
  userAddBlackListMessage = 'Vous ne pouvez plus tchater avec cet utilisateur. Il vous a mis dans sa liste noire.';
  yourAddBlackListMessage = `Vous ne pouvez plus tchater avec cet utilisateur.
    Il est dans votre liste noire. Gérer votre liste noire dans votre profil/options.`;
  constructor(
    private administrationApplicatifService: AdministrationApplicatifServiceACI,
    private authApplicatifService: AuthenticationApplicatifService,
    private autorisationService: AutorisationService,
    private cdr: ChangeDetectorRef,
    private chatMucService: ChatMucService,
    private cryptionAesService: CryptionAesService,
    private http: Http,
    private jwtHelper: JwtHelper,
    private messageService: MessageService,
    private mScrollbarService: MalihuScrollbarService,
    private mScrollbarService2: MalihuScrollbarService,
    private pagerService: PagerService,
    private photoPdp: PhotoPdp,
    private router: Router,
    private sharedDataService: SharedDataService,
    private tchatService: TchatService,
    private translate: TranslateService,
    private zone: NgZone,
    public dialog: MdDialog,
    public homeApplicatifServiceACI: HomeApplicatifServiceACI,
    public sharedService: SharedService,
    public tchatConnectionService: TchatConnectionService,
    public tchatForbiddenService: TchatForbiddenService,
    public tchatMessageService: TchatMessageService,
    public tchatPresenceService: TchatPresenceService,
    public tchatReceiptService: TchatReceiptService,
    public tchatRoomService: TchatRoomService
  ) {
    this.parser = new xml2js.Parser();

    this.baseUrl = environment.baseUrlAppUrl;
    this.baseUrl = this.baseUrl.replace('app_dev.php/', '');
    this.translate.get('noConversation').subscribe((res: string) => {
      this.noConversation = res;
    });
    //
    this.translate.get('noUser').subscribe((res: string) => {
      this.noUser = res;
    });

    this.translate.get('today').subscribe((res: string) => {
        this.today = res;
    });
    this.translate.get('daysAgo').subscribe((res: string) => {
        this.daysAgo = res;
    });

    this.administrationApplicatifService.listTermes().subscribe(termes => {
      this.tchatsForbidden = termes.value.filter(term => term.tchat);
  });

  this.translate.get('tchatNotAutorized').subscribe((res: string) => {
    this.tchatNotAutorized = res;
  });

    const token = sessionStorage.getItem('id_token');
    this.currentUser = this.jwtHelper.decodeToken(token);


   this.getDataTchatAfterShowingModal();

   }
    getDataTchatAfterShowingModal(): void {
        this.sharedService.tchatData.subscribe(data => {
            if (data) {
                this.userDetailId = '';
                this.currentMessageQueue.messages = [];
                this.userDetailId = data.userDetailId;
                this.onchangeLoading = true;
                this.zone.run(() => {
                    if (this.userDetailId === undefined) {
                        sessionStorage.removeItem('ctJid');
                        const allUnreadMessageCount = sessionStorage.getItem('allUnreadMessageCount');
                        if (allUnreadMessageCount !== undefined && allUnreadMessageCount !== null && +allUnreadMessageCount > 0) {
                            this.allUnreadMessageCount = +allUnreadMessageCount;
                            this.messageHeaderCount.allUnreadMessageCount = this.allUnreadMessageCount;
                            this.tchatMessageService.emitMessageCount(+allUnreadMessageCount);
                        }
                        if (this.connection) {
                            this.connection.disconnect();
                        }
                    }
                });
                this.initChatComponent();
                this.sharedService.tchatData.next(null);
            }
        });
    }
  ngOnChanges(changes: {[propertyName: string]: SimpleChange}) {
    this.waitingconnection = false;
    this.islogout = false;
    const isLogged = this.authApplicatifService.islogged();
    if (isLogged) {
      if (!this.showTchat || (this.redirectionUrl !== null && this.redirectionUrl !== undefined && this.redirectionUrl.length > 0)) {
        this.selectedContact = null;
        sessionStorage.removeItem('selectedContactUid');
        this.needSelectedContact = false;
        // console.log('this.needSelectedContact false', this.needSelectedContact);
      } else {
        this.needSelectedContact = true;
        // console.log('this.needSelectedContact true', this.needSelectedContact);
      }
      sessionStorage.setItem('needSelectedContact', String(this.needSelectedContact));

      const currentuserDetailId = changes['userDetailId'];

      if (this.currentUser.username && this.currentUser.username.toLocaleLowerCase().indexOf('robot') === 0) {
        this.zone.runOutsideAngular(() => { // begin: runOutsideAngular
          // robot test auto
          this.ngOnChangeFunction(currentuserDetailId);
        }); // end: runOutsideAngular
      } else {
        this.ngOnChangeFunction(currentuserDetailId);
      }
    }
  }

  ngOnChangeFunction(currentuserDetailId) {
    if (!this.onchangeLoading && (( currentuserDetailId && this.userDetailId) ||
    (this.redirectionUrl !== null && this.redirectionUrl !== undefined && this.redirectionUrl.length > 0) ||
    (!this.router.url.endsWith('/messages')))
    ) {
      this.onchangeLoading = true;
        this.zone.run(() => { // begin zone run
          console.log('ngOnChanges : ', this.userDetailId);
          if (this.userDetailId === undefined) {
            sessionStorage.removeItem('ctJid');
          }
          const allUnreadMessageCount = sessionStorage.getItem('allUnreadMessageCount');
          if (allUnreadMessageCount !== undefined && allUnreadMessageCount !== null && +allUnreadMessageCount > 0 ) {
            this.allUnreadMessageCount = +allUnreadMessageCount;
            this.messageHeaderCount.allUnreadMessageCount = this.allUnreadMessageCount;
            // console.log('****************** ngOnChanges  all : ', this.allUnreadMessageCount);
            this.tchatMessageService.emitMessageCount(+allUnreadMessageCount);
          }
          if (this.connection) {
            this.connection.disconnect();
          }
        }); // end zone run
        this.initChatComponent();
    }
  }

  getHeight() {
    const footerElement = document.getElementById('footer');
    const mobileElement = document.getElementsByClassName('mobile')[0];
    const blocksendwithTchatElement = document.getElementById('sendblock');
    const headerElement = document.getElementsByClassName('mat-tab-header')[0];
    const tchatSearchElement = document.getElementsByClassName('top-message')[0];

    const footerHeight = footerElement ? footerElement['offsetHeight'] : 0;
    const mobileHeight = mobileElement ? mobileElement['offsetHeight'] : 0;
    const headerHeight = headerElement ? headerElement['offsetHeight'] : 0;
    const blocksendwithTchatHeight = blocksendwithTchatElement ? blocksendwithTchatElement['offsetHeight'] : 0;
    const tchatSearchHeight = tchatSearchElement ? tchatSearchElement['offsetHeight'] : 0;

    const getWindowWidth = () => {
      return window.innerWidth;
    };
    if (window.innerWidth < 1024) {
      this.innerHeight = window.innerHeight - mobileHeight - headerHeight - footerHeight;
      this.messtchatHeight = window.innerHeight - mobileHeight - headerHeight - footerHeight - blocksendwithTchatHeight;
      // console.log(this.messtchatHeight,this.innerHeight );
    } else {
      // desktop

      this.innerHeight = window.innerHeight - headerHeight - footerHeight - tchatSearchHeight + 10;
      this.messtchatHeight = window.innerHeight - headerHeight - footerHeight - blocksendwithTchatHeight - tchatSearchHeight + 10;
      // console.log(tchatSearchHeight, this.messtchatHeight, this.innerHeight );

    }
    window.onresize = () => {
      const footerElement = document.getElementById('footer');
      const mobileElement = document.getElementsByClassName('mobile')[0];
      const blocksendwithTchatElement = document.getElementById('sendblock');
      const headerElement = document.getElementsByClassName('mat-tab-header')[0];
      const tchatSearchElement = document.getElementsByClassName('top-message')[0];

      const footerHeight = footerElement ? footerElement['offsetHeight'] : 0;
      const mobileHeight = mobileElement ? mobileElement['offsetHeight'] : 0;
      const headerHeight = headerElement ? headerElement['offsetHeight'] : 0;
      const blocksendwithTchatHeight = blocksendwithTchatElement ? blocksendwithTchatElement['offsetHeight'] : 0;
      const tchatSearchHeight = tchatSearchElement ? tchatSearchElement['offsetHeight'] : 0;

      if (window.innerWidth < 1024){
        this.innerHeight = window.innerHeight - mobileHeight - headerHeight - footerHeight;
        this.messtchatHeight = window.innerHeight - mobileHeight - headerHeight - footerHeight - blocksendwithTchatHeight;
        // console.log(this.messtchatHeight,this.innerHeight );
      } else {
        // desktop
        this.innerHeight = window.innerHeight - headerHeight - footerHeight - tchatSearchHeight + 10;
        this.messtchatHeight = window.innerHeight - headerHeight - footerHeight - blocksendwithTchatHeight - tchatSearchHeight + 10;
        // console.log(tchatSearchHeight, this.messtchatHeight, this.innerHeight );
      }
    };
  }

  ngOnInit() {
    this.autorisation = this.autorisationService.getAutorisation();
    this.subscribeTchatDisconnection();
    this.subscribeLanguageIsChanged();
    this.subscribeDeleteRoom();
  }

  getEmptySearch() {
    return this.pagedContacts && this.pagedContacts.length === 0 ?
     this.contactSearchTerm.length > 0 ? this.noUser : this.noConversation : '';
  }
  
  getLoading() {
    return this.loading;
  }

  get getPagedContacts() {
    // console.log("------------------------getPagedContacts");
    let contacts = this.tchatService.filterContacts(this.contacts, this.contactSearchTerm);
    if (this.contactSearchTerm.length > 0) {
      this.currentPage = 1;
    }
    this.totalItems = contacts !== undefined ? contacts.length : 0;
	  contacts = this.chatMucService.sortContacts(contacts, '-currentMessageTimestamp');
    this.pager = this.pagerService.getPager(this.totalItems, this.currentPage, 10);
    this.pagedContacts = contacts !== undefined ? contacts.slice(this.pager.startIndex, this.pager.endIndex + 1) : contacts;
    this.mScrollbarService.initScrollbar('#myElementId', { axis: 'y', theme: 'light-thick', scrollButtons: { enable: false } });
    return this.pagedContacts;
  }

  setPage(page: number) {
    this.currentPage = page;
  }

  initChatComponent() {
    this.contacts = [];
    if (!this.userName) {
      this.decriptLogin();
    }
    const contacts = sessionStorage.getItem('contact-' + this.userUid);
    if (contacts !== undefined && contacts !== null ) {
      const decryptedcontacts = this.cryptionAesService.decryptMessage(contacts);
      this.contacts = JSON.parse(decryptedcontacts);
    }
    this.loading = true;
    this.messageQueues = [];
    // console.log('initChatComponent' , this.messageQueues);
    this.boshService = environment.boshService;
    if (this.userDetailId) {
        if (this.userDetailId) {
            this.homeApplicatifServiceACI.getUserDetail(this.userDetailId).subscribe(userDetail => {
                this.userDetail = userDetail;
                if (!this.connection) {
                  this.chatConnect();
                } else {
                    this.createRoom();
                }
              });
        }
    } else {
      if (!this.connection) {
        this.chatConnect();
      } else {
          this.createRoom();
      }
    }
  }

  chatConnect() {
    this.decriptLogin();
    const chatconnection = this.sharedService.getChatConnection();
    if (!chatconnection) {
        this.connection =  new Strophe.Connection(this.boshService , {'keepalive': false});
        this.connection._hitError = (reqStatus) => {
          this.nbErrors ++;
          // console.log('+++ nbErrors ', this.nbErrors, ' reqStatus', reqStatus);
        };
        this.attachErrorHandlers(this.connection);
        // this.connection.connect(this.userName + '@' + environment.openfireServer + '/' + this.userUid,
        this.connection.connect(this.userUid + '@' + environment.openfireServer + '/' + this.userUid,
          this.password, this.runCallback(this.connexionCallback));
    } else {
        this.connection = chatconnection;
        this.connectionStatus = '5';
        this.initializeChat(this.connectionStatus);
    }
  }

  setRidSession() {
    if (this.connection && this.connection._proto) {
      // this.connection.pause();
      if (this.connection._proto.rid) {
        sessionStorage.setItem('bosh.rid', this.connection._proto.rid);
        console.log('----RID----', this.connection._proto.rid);
      }
      if (this.connection._proto.sid) {
        sessionStorage.setItem('bosh.sid', this.connection._proto.sid);
        console.log('----SID----', this.connection._proto.sid);
      }
      if (this.connection.jid) {
        sessionStorage.setItem('bosh.jid', this.connection.jid);
      }
    }
  }

  onConnectionError = (res) => {
    const needreload =  this.tchatConnectionService.onConnectionError(res, this.userName, this.connection);
    if (needreload) {
       location.reload();
    } else {
      this.showWarn('Deconnection', 'utilisation même compte pour deux ordi (device) différent non autorisé');
    }
  }

  attachErrorHandlers(connection) {
    connection.addProtocolErrorHandler('HTTP', 400, this.onConnectionError);
    connection.addProtocolErrorHandler('HTTP', 404, this.onConnectionError);
    connection.addProtocolErrorHandler('HTTP', 500, this.onConnectionError);
  }

  decriptLogin() {
    const username = sessionStorage.getItem('rfIl');
    const password = sessionStorage.getItem('rfIp');
    const decryptedUsername = this.cryptionAesService.decryptMessage(username);
    const decryptedPassword = this.cryptionAesService.decryptMessage(password);

    const encryptedUid = sessionStorage.getItem('rfIuid');
    this.userUid = this.cryptionAesService.decryptMessage(encryptedUid);
    // this. userUid = 'mamison603';
    if (decryptedUsername) {
      this.userJid = decryptedUsername.toLocaleLowerCase() + '@' + environment.openfireServer;
    }

    this.userName = decryptedUsername;
    this.password = decryptedPassword;
  }

  private connexionCallback = (status) => {
    this.connectionStatusChanged = false;
    if (this.connectionStatus !== status) {
      this.connectionStatusChanged = true;
    }
    this.connectionStatus = status;
    this.sharedService.setChatConnection(this.connection);

    if (this.connectionStatusChanged) {
      this.initializeChat(this.connectionStatus);
    }
  }
  
  private runCallback = (connexionCallback) => {
    return function() {
      try {
        connexionCallback.apply(this, arguments);
      } catch (e) {
      }
      // Return true to keep calling the callback.
      return true;
    };
  }

  private setDefaultMessageQueue() {
    this.needTriggerLoader = false;
    let showfirst = true;
    if (!this.showTchat || (this.redirectionUrl !== null && this.redirectionUrl !== undefined && this.redirectionUrl.length > 0)) {
      // console.log('+++++++++++++++++++++++++ set selectedContact -------- ', this.selectedContact);
      this.needTriggerLoader = true;
      this.setCurrentmessage(this.contacts[this.contacts.length - 1]);
    } else {
      const contactJid = sessionStorage.getItem('ctJid');
      if (contactJid !== null || this.ctJid) {
        const decryptedjid = this.ctJid ? this.ctJid : this.cryptionAesService.decryptMessage(contactJid);
        // openfire problem casse
        // console.log('****** selected contact', decryptedjid, this.ctJid);
        const existContact = this.contacts.find(ct => ct.jid.toLocaleLowerCase() === decryptedjid.toLocaleLowerCase());
        if (existContact) {
          this.setCurrentContact(existContact);
          showfirst = false;
        }
      }
      if (showfirst) {
        this.setCurrentContact(this.contacts[this.contacts.length - 1]);
      }
      // console.log('++++++++++++++++++++++++ set selectedContact -------- ', this.selectedContact);
    }
  }

  subscribeLanguageIsChanged() {
    this.sharedService.getLanguageIsChanged.subscribe(language => {
      if (language && language.isChanged) {
        this.translate.use(language.language);
        this.translate.get('today').subscribe((res: string) => {
            this.today = res;
            this.translate.get('daysAgo').subscribe((result: string) => {
              this.daysAgo = result;
              this.translate.get('tchatNotAutorized').subscribe((res: string) => {
                this.tchatNotAutorized = res;
              });
              this.reloadMessageAndContacts(language);
          });
        });
      }
    });
  }

  reloadMessageAndContacts( language){
    this.contacts.forEach(contact =>
      contact.currentMessageRelativeDate =
      this.chatMucService.getRelativeDay(contact.currentMessageTimestamp, language.language, this.today, this.daysAgo)
    );
    this.messageQueues.forEach(messageQueue =>
      messageQueue.messages.forEach(message =>
        message.messageDate =
          this.chatMucService.getRelativeDay(message.timestamp, this.translate.currentLang, this.today, this.daysAgo)
      )
    );
  }

  subscribeDeleteRoom() {
    this.sharedService.getUserUidRoom.subscribe(userUid => {
        if (userUid) {
          const OpenfireApiRest = environment.OpenfireChatApiRest + 'chatrooms';
          return this.chatMucService.searchRoom(this.userUid, OpenfireApiRest).toPromise()
          .then((res) => {
            const items = res.json().chatRoom;
            if (items) {
              if (Array.isArray(items)) {
                sessionStorage.removeItem('contact-' + this.userUid);
                  items.forEach(room => {
                    console.log('delete room', room);
                    this.chatMucService.deleteInstantRoom(room.roomName + '@' + environment.openfireConference,
                      this.connection, this.userUid, this.password,
                      this.chatMucService.onDeleteRoomSuccess, this.chatMucService.onDeleteRoomError);
                  });
                  this.sharedService.setUserUidRoom = '';
                  this.router.navigate(['/login']);
              } else {
                console.log('delete room', items.roomName);
                sessionStorage.removeItem('contact-' + this.userUid);
                this.chatMucService.deleteInstantRoom(items.roomName + '@' + environment.openfireConference,
                      this.connection, this.userUid, this.password,
                      this.chatMucService.onDeleteRoomSuccess, this.chatMucService.onDeleteRoomError);
                this.sharedService.setUserUidRoom = '';

                this.router.navigate(['/login']);
              }
            }
          }).catch((err) => {
            console.log(err);
            this.sharedService.setUserUidRoom = '';
            this.router.navigate(['/login']);
         });
        }
    });
}

subscribeTchatDisconnection() {
    this.sharedService.getChatDisconnection.subscribe(islogout => {
          if (islogout) {
            // this.islogout = true;
            for (const sessionKey in sessionStorage) {
              if (sessionStorage.hasOwnProperty(sessionKey) && sessionKey.endsWith('-')) {
                console.log(sessionKey);
                sessionStorage.removeItem(sessionKey);
              }
            }
            sessionStorage.removeItem('contact-' + this.userUid);
            if ( this.connection) {
              this.tchatPresenceService.clearConnection(this.connection);
              sessionStorage.removeItem('contact-' + this.userUid);
              /* this.router.navigate(['/splashcreen']).then(() => {
                location.reload();
                this.sharedService.setLogout = false;
                this.sharedService.setChatDisconnection(false);
                console.log('reload et relocation header');
            }); */
            } else {
              sessionStorage.removeItem('waitingLogout');
              this.router.navigate(['/splashcreen']);
              this.sharedService.setChatDisconnection(false);
            }
            console.log('logout ok');
          }
    });
  }

  initializeChat(status) {
    switch (+status) {
      case Strophe.Status.CONNECTED:
      case Strophe.Status.ATTACHED:
        console.log('Connexion - connected');
        console.log(this.connection._proto.sid);
        if (this.connection) {
          this.connection.send($pres());
          this.setRidSession();
        }
        if (!this.waitingconnection) {
          this.waitingconnection = true;
          this.createRoom();
          this.attachHandlers();
        }
        break;
      case Strophe.Status.CONNFAIL:
        console.log('Connexion - fail');
        break;
      case Strophe.Status.DISCONNECTING:
        console.log('Connexion - disconnecting');
        this.loading = false;
        this.getHeight();
        break;
      case Strophe.Status.DISCONNECTED:
        console.log('Connexion - disconnected');
        if (this.islogout) {
          console.log('user  logout');
          this.islogout = false;
          sessionStorage.removeItem('waitingLogout');
            this.router.navigate(['/splashcreen']).then(() => {

                    if (this.sharedService.openfireError) {
                      this.authApplicatifService.updateConnectionStatus('0');
                      this.router.navigate(['/splashcreen'], { queryParams: { alreadyConnected: true } });
                      location.reload();
                      console.clear();
                      console.log('====================RELOAD=========');
                    }

            });
        }
        const isLogged = this.authApplicatifService.islogged();
        if (isLogged) {
          if (this.tchatService.needReconnection()) {
            this.showWarn('tchat disconnected', 'wait reconnection');
            this.onChatDisconnected();
          }
        }
        break;
      case Strophe.Status.CONNECTING:
        console.log('Connexion - connecting');
        break;
    }
  }

  onChatDisconnected() {
    setTimeout(() => this.reconnectToOpenfire(), 5000);
    /* this.connection.attach(
        sessionStorage.getItem('bosh.jid'),
        sessionStorage.getItem('bosh.sid'),
        sessionStorage.getItem('bosh.rid'),
        this.runCallback(this.connexionCallback)); */
  }

  reconnectToOpenfire() {
    setTimeout(
      // this.connection.connect(this.userName + '@' + environment.openfireServer,
      this.connection.connect(this.userUid + '@' + environment.openfireServer,
      this.password, this.runCallback(this.connexionCallback)), 500);
  }

  getRooms (userRoom) {
    this.rooms = [];
    this.onGetRooms(environment.openfireConference, userRoom, this.onsearchRoomsSuccess, this.onsearchRoomsError);
  }

  onGetRooms (conferenceId, userRoom, onlistRoomsSuccess, onlistRoomsError) {
      this.tchatMessageService.searchRooms(userRoom)
      .subscribe(onlistRoomsSuccess, onlistRoomsError);
  }

  initializeContact(roomName, roomJid) {
    const existRoom = this.rooms.find(room => room.jid === roomJid);
    if (!existRoom) {
      this.rooms.push(new Room(roomJid, roomName));
      let contactUid = roomName;
      // toLocaleLowerCase problème config openfire
      const searchIndex = roomName.indexOf(this.userUid.toLocaleLowerCase());
      if (searchIndex >= 0) {
        contactUid  = this.tchatMessageService
          .truncateFromString(roomName, searchIndex, searchIndex + this.userUid.length, this.userUid, '|');
        if (contactUid.length === 0) {
          Promise.resolve(false);
        } else {
          // getUserPdpUid
          return new Promise((resolve, reject) => {
            this.contactsUid.push(contactUid);
            this.tchatService.pushContact('', roomJid, contactUid, '', this.contacts);
            resolve(true);
          });
        }
      }
    }
    Promise.resolve(false);
  }

  onsearchRoomsSuccess = (result) => {
    const promises = this.onsearchRoomsCallback(result);
    Promise.all(promises).then(() => {
      // console.log('onsearchRoomsSuccess - contacts : ', this.contacts);
      this.joinContactMessages();
    }).catch((err) => {
      console.log(err);
      this.joinContactMessages();
   });
  }

  joinContactMessages() {
    this.tchatService.getContactsPdp(this.contacts, this.showConversation)
    .then((contacts) => {
       this.contacts = contacts as Contact[];
      // console.log(' ................ contacts : ', this.contacts);
      this.initMessageQueues( this.contacts);
      this.joinRooms();
      this.setDefaultMessageQueue();
    }).catch((err) => {
      this.initMessageQueues( this.contacts);
      this.joinRooms();
      this.setDefaultMessageQueue();
    });
  }

  onsearchRoomsCallback(result) {
    const promises = [];
      const rooms = result.json().chatRoom;
      if (result.json().chatRoom !== undefined) {
        if (Array.isArray(rooms)) {
          result.json().chatRoom.map(room => {
            const roomName = room.roomName;
            const roomJid = room.roomName + '@' + environment.openfireConference;
            promises.push(this.initializeContact(roomName, roomJid));
          });
        } else {
          const roomName =  result.json().chatRoom.roomName;
          const roomJid = result.json().chatRoom.roomName + '@' + environment.openfireConference;
          promises.push(this.initializeContact(roomName, roomJid));
        }
      } else {
        promises.push(Promise.resolve(true));
      }
      return promises;
  }

  onsearchRoomsError = (result) => {
    this.loading = false;
    this.getHeight();
  }
 
  private joinRooms() {
    // console.log('initializing rooms of all contacts: ', this.contacts, ' length : ', this.contacts.length);
    const promises = [];
    this.contacts.forEach(contact => {
        const unavailablePromise =  new Promise((resolve, reject) => {
          this.joinRoom(contact, this.userName, this.password, this.userUid);
          resolve(true);
        });
        promises.push(unavailablePromise);
      });
    Promise.all(promises).then(() => {
      this.loading = false;
      this.getHeight();
      this.cdr.detectChanges();
      this.setPage(1);
      this.sharedService.setTchatIsLoaded(true);
    }).catch((err) => {
      this.loading = false;
      console.log(err);
   });
  }

  private initMessageQueues(contacts: Contact[]) {
    this.messageQueues = contacts.map(ct => ({
       contactJid: ct.jid, messages: []
      })
    );
  }

  joinRoom (contact, nick, password, userUid) {
      const room1 = userUid + '|' + contact.uid + '@' + environment.openfireConference;
      const room2 = contact.uid + '|' + userUid + '@' + environment.openfireConference;
      const existRoom = this.rooms.find(room => (room.jid === room1.toLowerCase() || room.jid === room2.toLowerCase()));
      if (existRoom) {
        // console.log('Join - room : ', existRoom.jid, ' - nick : ', nick + '+' + userUid);
        if (!this.messageHeaderCount.allUnreadMessageCount) {
            this.messageHeaderCount.allUnreadMessageCount = 0;
         }
         try {
          /* console.log('----------------------  room : ', existRoom.jid);*/
          this.connection.muc.join(existRoom.jid, userUid,
          this.onMessageMucCallback,
          function (message) {
              // console.log("onRosterCallback - contact: ", contact);
          },
            password,
            {
              maxstanzas: 100
            }
          );
        } catch (e) {
          console.log('joinRoom: ', e);
        }
      }
  }
  
  onMessageMucCallback(message) {
     // console.log('---------------------- onMessageMucCallback : ', message);
      const parsedMessage = this.tchatMessageService.parseMucMessage(message, this.userUid, this.contacts);
      this.contactIsComposing = parsedMessage.status === 'composing' ? (parsedMessage.from !== this.currentUser.uid) : false;  
      // console.log('message sent to me',parsedMessage);  
      if (parsedMessage.body !== null && parsedMessage.body.length > 0) {
          console.log('userUid', this.userUid);
          this.tchatMessageService.onMessageCallbackEngine(message,parsedMessage, this.userUid, this.contacts, this.messageQueues, this.selectedContact, this.messageHeaderCount);
      }
    return true;
  }

  private attachHandlers() {
    if (!this.messageHeaderCount.allUnreadMessageCount) {
      this.messageHeaderCount.allUnreadMessageCount = 0;
    }
    this.chatMucService.attachHandlers(this.connection,
      (res) => this.onMessageMucCallback(res),
        (res) => this.tchatPresenceService.onPresenceMucCallback(res, this.contacts, this.userUid, this.statusChangeCb),
        (res) => this.tchatReceiptService.onReceipt(res,
          this.contacts, this.messageQueues, this.translate.currentLang,
          this.userUid, this.today, this.daysAgo, this.connection));
  }

  statusChangeCb = (contact) => {
    this.selectContactEvent.emit(contact);
  }

  setCurrentmessage(contact: Contact) {
      const me = this;
      this.currentContact = contact;
      this.currentMessageQueue = this.messageQueues.find(msgQueue => msgQueue.contactJid === contact.jid);
      const existContact = this.contacts.find(ct => ct.jid === contact.jid);
      if (existContact && this.showConversation) {
        const messageCount = this.allUnreadMessageCount - existContact.unreadMessageCount;
        this.allUnreadMessageCount = messageCount > 0 ? messageCount : 0;
        this.messageHeaderCount.allUnreadMessageCount = this.allUnreadMessageCount;
        this.tchatMessageService.emitMessageCount(this.allUnreadMessageCount);
          existContact.unreadMessageCount = 0;
      }
      const cryptedContacts = this.cryptionAesService.cryptMessage(JSON.stringify(this.contacts));
      sessionStorage.setItem('contact-'  + this.userUid, cryptedContacts.toString());
      this.mScrollbarService2.initScrollbar('#messageId', { axis: 'y', theme: 'light-thick', scrollButtons: { enable: true },
      callbacks: { onInit: function () { me.scrollToBottom(me); } } });
  }

  scrollToBottom(me: any): void {
    me.mScrollbarService2.scrollTo('#messageId', 'bottom', { scrollInertia: 0 });
  }

  setCurrentContact(contact: Contact, afterClickContact?: boolean) {
      const me = this;
      this.selectedContact = contact;
      this.selectContactEvent.emit(this.selectedContact);
      sessionStorage.setItem('selectedContactUid', String(contact.uid));
      if (afterClickContact) {
          this.sharedDataService.onSelectContact.next(this.selectedContact);
      }
      this.mScrollbarService2.initScrollbar('#messageId', {
          axis: 'y', theme: 'light-thick', scrollButtons: { enable: true },
          callbacks: { onUpdate: function () { me.scrollToBottom(me); } }
      });
      if (this.redirectionUrl !== null && this.redirectionUrl !== undefined && this.redirectionUrl.length > 0) {
          // TODO get uid by pseudo and replace url
          this.homeApplicatifServiceACI.checkinBlackList(contact.name)
              .subscribe(res => {
                  if (res.isBlackList === true || res.isUserAddBlackList) {
                      const errorMessage = res.isUserAddBlackList ? this.userAddBlackListMessage : this.yourAddBlackListMessage;
                      this.errorCallback(errorMessage);
                      this.router.navigate(['/home/messages']);
                  } else {
                      this.redirectionUrl = this.redirectionUrl.replace('undefined', contact['uid']);
                      const ctJid = this.cryptionAesService.cryptMessage(contact.jid);
                      sessionStorage.setItem('ctJid', ctJid.toString());
                      this.router.navigate([this.redirectionUrl]);
                  }
              }, err => {
                  this.errorCallback(err);
              });
      } else {
          if (this.typedMessage && this.currentContact && contact.jid !== this.currentContact.jid) {
              this.typedMessage = '';
          }
          if (contact) {
            const messageCount = this.allUnreadMessageCount - contact.unreadMessageCount;
            this.allUnreadMessageCount = messageCount > 0 ? messageCount : 0;
            this.messageHeaderCount.allUnreadMessageCount = this.allUnreadMessageCount;
            this.tchatMessageService.emitMessageCount(this.allUnreadMessageCount);
            contact.unreadMessageCount = 0;
          }

          // Mark all message from this contact as read.
          // Verifier si dans blacklist seulement apres clic sur contact (liste à gauche)
          if (afterClickContact) {
              this.homeApplicatifServiceACI.checkinBlackList(contact.name)
                  .subscribe(res => {
                    if (res.isBlackList === true || res.isUserAddBlackList) {
                        const errorMessage = res.isUserAddBlackList ? this.userAddBlackListMessage : this.yourAddBlackListMessage;
                        this.errorCallback(errorMessage);
                    } else {
                          this.setCurrentmessage(contact);
                      }
                  }, err => {
                      this.errorCallback(err);
                  });
          } else {
              this.setCurrentmessage(contact);
          }
      }
  }

  showWarn(summary: string, msg: string) {
      this.msgs = [];
      this.msgs.push({ severity: 'error', summary: summary, detail: msg });
  }

  sendMessage() {
    if (this.typedMessage && this.typedMessage.length > 0) {
        this.tchatReceiptService.sendMessageEngine(this.typedMessage, this.currentContact,
          this.contacts, this.connection, this.userUid).subscribe(result => {
            if (result.statut === 'ok') {
                this.currentMessageQueue.messages.push(result.message);
                this.typedMessage = '';
                this.typing = false;
            } else { 
                this.errorCallback(result.message);
            }
        });
    }
  }

  keyPressOnChatInput() {
    const to = this.currentContact || this.contacts[0];
    if (!this.typing) {
      const notif = $msg({
        to: to.roomJid, 'type': 'groupchat',
        chatState: 'composing'
       }).c('composing', {});
      this.connection.send(notif);
      this.typing = true;
    }
  }

  createRoom() {
      // console.log("currentUser : ", this.currentUser," pseudo : ",this.userDetail.pseudo);
      const OpenfireApiRest = environment.OpenfireChatApiRest + 'chatrooms';
      this.rooms = [];
      this.searchRoom(OpenfireApiRest);
  }

  searchRoom(OpenfireApiRest) {
    let roomJid = '';
    return this.chatMucService.searchRoom(this.userUid, OpenfireApiRest).toPromise()
    .then((res) => {
      return this.tchatService.onsearchRoomSuccess(res, this.userDetail, this.userDetailId, this.currentUser );
    }).then((res) => {
      if (res['isNewRoom']) {
        roomJid = res['roomJid'];
        return this.chatMucService.createRoom(res['roomJid'], res['pseudo'], this.connection);
      } else {
        return Promise.resolve(false);
      }
    }).then((res) => {
      return res ? this.chatMucService.configureRoom(roomJid, this.connection) :
      Promise.resolve({
        isSuccess: false,
          data : null
      });
    })
    .then((res) => {
      if (res['isSuccess']) {
        return this.chatMucService.saveConfigurationRoom(roomJid, res['data'], this.connection);
      }
      return Promise.resolve(true);
    })
    .then((res) => {
      this.getRooms(this.userUid);
    })
    .catch((err) => {
      console.log(err);
      this.getRooms(this.userUid);
  });
  }

  focusoutChat() {
      const to = this.currentContact || this.contacts[0];
      if (this.typing) {
        const notif = $msg({
          to: to.roomJid, 'type': 'groupchat'
        }).c('active', {});
        this.connection.send(notif);
        this.typing = false;
      }
  }

  public popupAction() {
      this.showAction = !this.showAction;
  }

  onClick(event): void {
      const target = event.target || event.srcElement;
      if (target.id !== 'linkPopup' && target.id !== 'blacklisterLabel' && target.id !== 'reportLabel'){
          this.showAction = false;
      }
  }

  openConfirmDialog(): void {
          this.popupAction();
          const dialogRef = this.dialog.open(ConfirmMessageComponent, {
              width: '350px',
              data: this.currentContact
          });

          dialogRef.afterClosed().subscribe(result => {
              console.log(result);
          });
  }

  openReportabusDialog(): void {
        this.popupAction();
        const pseudo = this.currentContact && this.currentContact.name ? this.currentContact.name : '';
        const data = {
            pseudo: pseudo,
            motif: '',
            contenu: '',
            idStatut: 1
        };
        const dialogRef = this.dialog.open(ModalReportabusComponent, {
            width: '350px',
            data: data
        });
  }

  addToBlackList(pseudo: string): void {
    this.homeApplicatifServiceACI.addToBlackList(pseudo)
        .subscribe(res => {
            console.log(res);
            if (res.result) {
                this.router.navigate(['/home/messages']);
            } else {
                console.log('ERROR');
                this.router.navigate(['/home/messages']);
            }
        },
        err => {
            this.errorCallback(err);
        });
  }
  
  errorCallback(err): void {
     this.msgs = [];
      this.msgs.push({ severity: 'error', summary: '', detail: err });
  }
}
