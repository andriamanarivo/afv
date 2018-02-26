import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';

@Injectable()
export class SharedService {

    objectSource: BehaviorSubject<any> = new BehaviorSubject({});
   private nbFavoris: BehaviorSubject<number> = new BehaviorSubject(0);

   private nbMessages: BehaviorSubject<number> = new BehaviorSubject(0);

   public openfireError = 0;

   private isIdle: BehaviorSubject<boolean> = new BehaviorSubject(false);

   private logout: BehaviorSubject<boolean> = new BehaviorSubject(false);
   
   public onupdatefavoris: BehaviorSubject<boolean> = new BehaviorSubject(false);
   public allConnectedUsers: BehaviorSubject<Array<any>> = new BehaviorSubject([]);

   private userUidRoom: BehaviorSubject<string> = new BehaviorSubject('');

   public trieChange: BehaviorSubject<any> = new BehaviorSubject({});
   public resultImgUrl: BehaviorSubject<string> = new BehaviorSubject("");
   public onDescriptionIsRejected: BehaviorSubject<boolean> = new BehaviorSubject(false);


   private headerHeight: BehaviorSubject<number> = new BehaviorSubject(0);
    private nbVisiteur: BehaviorSubject<number> = new BehaviorSubject(0);
   private userConnete: BehaviorSubject<string> = new BehaviorSubject('');
   private lstFavoris: BehaviorSubject<any> = new BehaviorSubject([]);
   private lstGauche: BehaviorSubject<any> = new BehaviorSubject([]);
   public showDetailAbusEvent: BehaviorSubject<any> = new BehaviorSubject({});
   public photoUrl: BehaviorSubject<string> = new BehaviorSubject("");
   /* private chatConnection: BehaviorSubject<any> = new BehaviorSubject(null); */

   // tslint:disable-next-line:member-ordering
   private static chatConnection: any;
   public favorisData: BehaviorSubject<any> = new BehaviorSubject({});
   public showAddPhotoProfilModal: BehaviorSubject<boolean> = new BehaviorSubject(false);
   public isFirstConnexion: BehaviorSubject<boolean> = new BehaviorSubject(false);
   /* public confirmCookie: BehaviorSubject<boolean> = new BehaviorSubject(true); */
   public onUpdateSetting: BehaviorSubject<string> = new BehaviorSubject('');
   public stateProfil: BehaviorSubject<number> = new BehaviorSubject(0);

   private tchatDisconnect: BehaviorSubject<boolean> = new BehaviorSubject(false);
   public closeAllModal: BehaviorSubject<boolean> = new BehaviorSubject(false);
   public tchatData: BehaviorSubject<any> = new BehaviorSubject(null);

   private languageIsChanged: BehaviorSubject<any> = new BehaviorSubject(null);
   private AbusPage: BehaviorSubject<number> = new BehaviorSubject(1);

   private tchatIsLoaded: BehaviorSubject<boolean> = new BehaviorSubject(false);

    constructor() { }

    setTchatIsLoaded(value: boolean) {
        this.tchatIsLoaded.next(value);
    }
    get getTchatIsLoaded(): Observable<boolean> {
        return this.tchatIsLoaded.asObservable();
    }

    setLanguageIsChanged(value: any) {
        this.languageIsChanged.next(value);
    }
    get getLanguageIsChanged(): Observable<any> {
        return this.languageIsChanged.asObservable();
    }

    setChatDisconnection(value: boolean) {
        this.tchatDisconnect.next(value);
    }
    get getChatDisconnection(): Observable<any> {
        return this.tchatDisconnect.asObservable();
    }
    setChatConnection(value: any) {
        SharedService.chatConnection = value;
    }
    getChatConnection(): any {
        return !SharedService.chatConnection ? null : SharedService.chatConnection;
    }

    sendMessage(message: string) {
        this.objectSource.next({ text: message });
    }

    getMessage(): Observable<any> {
        return this.objectSource.asObservable();
    }

    set favoris(value: number) {
        this.nbFavoris.next(value);
    }

    get favoris$(): Observable<number> {
        return this.nbFavoris.asObservable();
    }
    set visiteur(value: number) {
        this.nbVisiteur.next(value);
    }

    get visiteur$(): Observable<number> {
        return this.nbVisiteur.asObservable();
    }

    set listeFavoris(value: any) {
        this.lstFavoris.next(value);
    }
    get listeFavoris$(): Observable<any> {
        return this.lstFavoris.asObservable();
    }

    set idUserConnete(value: string) {
        this.userConnete.next(value);
    }
    get idUserConnete$(): Observable<string> {
        return this.userConnete.asObservable();
    }

    setNbFavoris(value: number) {
        this.nbFavoris.next(value);
    }


    getNbFavoris() {
        return this.nbFavoris.asObservable();
    }

    setNbVisiteur(nb: number) {
        this.nbVisiteur.next(nb);
    }

     getNbVisiteur() {
        return this.nbVisiteur.asObservable();
    }

    set listeGauche(value: any) {
        this.lstGauche.next(value);
    }
    get listeGauche$(): Observable<any> {
        return this.lstGauche.asObservable();
    }

    set setUserUidRoom(value: string) {
        this.userUidRoom.next(value);
    }

    get getUserUidRoom(): Observable<string> {
        return this.userUidRoom.asObservable();
    }
    set setLogout(value: boolean) {
        this.logout.next(value);
    }

    get getLogout(): Observable<boolean> {
        return this.logout.asObservable();
    }
    set setActivateIdle(value: boolean) {
        this.isIdle.next(value);
    }

    get getActivateIdle(): Observable<boolean> {
        return this.isIdle.asObservable();
    }
    set setTchatMessageCount(value: number) {
        this.nbMessages.next(value);
    }

    get getTchatMessageCount(): Observable<number> {
        return this.nbMessages.asObservable();
    }

    set setOpenfireError(value: number) {
        this.openfireError = value;
    }

    get getOpenfireError():number {
        return this.openfireError;
    }

    set setHeaderHeight(value: number) {
        this.headerHeight.next(value);
    }

    get getHeaderHeight(): Observable<number> {
        return this.headerHeight.asObservable();
    }

    setAbusPage(user: any): void {
        this.AbusPage.next(user);
    }

     getAbusPage(): Observable<any> {
        return this.AbusPage.asObservable();
    }

}
