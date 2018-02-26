import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Inscription } from '../../../donnee/inscription/inscription';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable'; 

@Injectable()
export class SharedDataService {
    public test : string = "test";

    previousValues= new BehaviorSubject([]); 

    errorsOnSubscribe = new BehaviorSubject([]); 
    chatConnection : BehaviorSubject<any> = new BehaviorSubject({});
    inscriptionsteps : BehaviorSubject<any> = new BehaviorSubject({});
    public listAlbums = new BehaviorSubject([]); 
    
    public onSelectContact: BehaviorSubject<any> = new BehaviorSubject({});
    
    processinscriptionsteps : BehaviorSubject<any> = new BehaviorSubject({});

    resetPassword : BehaviorSubject<any> = new BehaviorSubject({});
    uid : BehaviorSubject<string> = new BehaviorSubject("");

    inscriptionConfirm : BehaviorSubject<any> = new BehaviorSubject({});
    // Sidebar visibility
    sidebarVisible: boolean;
    sidebarVisibilitySubject: Subject<boolean> = new Subject<boolean>();

    etapeInscriptionSubject: BehaviorSubject<number> = new BehaviorSubject<number>(0);


    userConnected : BehaviorSubject<any> = new BehaviorSubject({});

    constructor() { 
        this.sidebarVisible = false
    }

    setPreviousValue(inscription:any){
        this.previousValues.next(inscription);
    }

    setChatConnection(connection: any): void {
        this.chatConnection.next(connection);
    }

    setErrorsOnSubscribe(errors: any): void{
        this.errorsOnSubscribe.next(errors);
    }
    
    setinscriptionsteps(inscriptionsteps: any): void {
        this.inscriptionsteps.next(inscriptionsteps);
    }
    setprocessinscriptionsteps(processinscriptionsteps: Inscription): void {
        this.processinscriptionsteps.next(processinscriptionsteps);
    }

    
    clearprocessinscriptionsteps() {
        //this.processinscriptionsteps.next({});
        this.processinscriptionsteps = new BehaviorSubject({});
        //this.processinscriptionsteps.unsubscribe();
    }

    setResetPassword(resetPassword: any): void {
        this.resetPassword.next(resetPassword);
    }

    //userConnected

    setUserConnected(user: any): void {
        this.userConnected.next(user);
    }

     getUserConnected(): Observable<any> {
        return this.userConnected.asObservable();
    }

    clearResetPassword() {
        this.resetPassword.next({});
    }

    setInscriptionConfirm(inscriptionConfirm: any): void {
        this.inscriptionConfirm.next(inscriptionConfirm);
    }
    /*   
    setEtapeInscriptionSubject(step: number): void {
        this.etapeInscriptionSubject.next(step);
    }
    */
    //newInscriptionSubject

    setEtapeInscription(etape: number) {
        this.etapeInscriptionSubject.next(etape);
    }
 
    clearEtapeInscription() {
        this.etapeInscriptionSubject.next(0);
    }
    
    
    getEtapeInscription(): Observable<number> {
        return this.etapeInscriptionSubject.asObservable();
    }

    clearInscriptionConfirm() {
        this.processinscriptionsteps.next({});
    }

    toggleSidebarVisibilty() {
        this.sidebarVisible = !this.sidebarVisible
        this.sidebarVisibilitySubject.next(this.sidebarVisible);
    }
}
