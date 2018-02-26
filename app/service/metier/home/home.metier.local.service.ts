import { Injectable } from '@angular/core';
import { HomeMetierServiceACI } from '.';

@Injectable()
export class HomeMetierLocalService implements HomeMetierServiceACI {
    public refreshToken(data: any) {
        throw new Error("Method not implemented.");
    }
    public getAllConnectedUsers() {
        throw new Error("Method not implemented.");
    }
    public removeSearch(search: any) {
        throw new Error('Method not implemented.');
    }
    public getNbVisiteurAndFavoris() {
        throw new Error('Method not implemented.');
    }
    public  addOrVerifyPayment(data) {
        throw new Error('Method not implemented.');
    }
    public addDeleteRoleAbonne(action){
        throw new Error('Method not implemented.');
    }
    public getAbus() {
        throw new Error('Method not implemented.');
    }
    public reportAbus(data: any) {
        throw new Error('Method not implemented.');
    }
    public checkinBlackList(pseudo: string) {
        throw new Error('Method not implemented.');
    }
    public addToBlackList(uid: string) {
        throw new Error('Method not implemented.');
    }
    public removeToBlackList(uid: string) {
        throw new Error('Method not implemented.');
    }
    public blacklist(uid: string, page: number, size: number) {
        throw new Error('Method not implemented.');
    }
    public getSetting() {
        throw new Error('Method not implemented.');
    }
    public getBlackLlist(pseudo: string) {
        throw new Error('Method not implemented.');
    }
    public getUserSetting(uid: string) {
        throw new Error('Method not implemented.');
    }
    public getCurrentSouscription(uid: string) {
        throw new Error('Method not implemented.');
    }
    public renouvelerSouscription(data: any) {
        throw new Error('Method not implemented.');
    }
    public resilierSouscription(data: any) {
        throw new Error('Method not implemented.');
    }
    public subscribeToOffer(data: any) {
        throw new Error('Method not implemented.');
    }
    public getOffres(id: any) {
        throw new Error('Method not implemented.');
    }
    public getFormRecherche() {
        throw new Error('getRecherche local');
    }
    public rechercheAutocomplete(name: string) {
        throw new Error('rechercheAutocomplete local');
    }

    public getListRecherche() {
        throw new Error('getListeRecherche local');
    }
    public  recherche(data, min, max, order) {
        throw new Error('recherche local');
    }
    public  getVisiteur(data, min, max, order) {
        throw new Error('recherche local');
    }
    public getHome(id: number) {
        throw new Error('getHome local');
    }
    public getHomes() {
        throw new Error('getHomes local');
    }
    public setHome(id: number) {
        throw new Error('setHome local');
    }

    public getUserByCity(page: number, size: number, sortData?: any) {
        throw new Error('getUserByCity local');
    }

    public getUserDetail() {
        throw new Error('getUserDetail local');
    }
    public getUserConnecte() {
         throw new Error('Method not implemented');
    }

    public updateProfil(oUser) {
        throw new Error('Method not implemented');
    }
    public  listePhoto(id: string, _public) {
        throw new Error('Method not implemented');
    }    
    public  ajouterPhoto(oPhoto) {
        throw new Error('Method not implemented');
    }
    public  deletePhoto(data) {
        throw new Error('Method not implemented');
    }
    public  editerPhotoProfil(data) {
        throw new Error('Method not implemented');
    }   
    public  addFavoris(id: string) {
        throw new Error('Method not implemented');
    }
    public  deleteFavoris(id: string) {
        throw new Error('Method not implemented');
    } 
    public listeFavoris(uid: string, page: number, size: number, sortData?: any){
        throw new Error('Method not implemented');
    }
    public create_Search(data) {
        throw new Error('Method not implemented');
    }
    public create_Souscription(data) {
        throw new Error('Method not implemented');
    }
     public  getSouscriptionDetail(id: string) {
        throw new Error('Method not implemented');
    }
     public  getAllSouscription() {
        throw new Error('Method not implemented');
    }
    public  updatePseudoEmail(pseudo: string, email: string) {
        throw new Error('Method not implemented');
    }
    
    public getUserPdpUid(pseudo: string) {
        throw new Error('Method not implemented.');
    }

    public getUserPdpUids(uids: Array<string>) {
        throw new Error('Method not implemented.');
    }

    public getUserPdpPseudos(pseudos: Array<string>) {
        throw new Error('Method not implemented.');
    }

    public getListGestionNotification() {
        throw new Error('Method not implemented');
    }

    public editStatutNotification(gestion) {
        throw new Error('Method not implemented');
    }

    public createOffre(data: any) {
         throw new Error('Method not implemented');
    }

    public updateOffre(data: any) {
         throw new Error('Method not implemented');
    }

    public subscribeNewsletter(uid: string,checked: boolean) {
         throw new Error('Method not implemented');
    }

    public getSubscribedNewsletter(){
        throw new Error('Method not implemented');
    }
    public addOrUpdateCodesPromo(data){
        throw new Error('Method not implemented');
    }
    public getListCodesPromo(data){
        throw new Error('Method not implemented');
    }
    public getDetailCodesPromo(data){
        throw new Error('Method not implemented');
    }


}
