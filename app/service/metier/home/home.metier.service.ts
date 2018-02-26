import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
// import 'rxjs/Rx';

import { HomeRest } from '../../rest/home/home.rest';

import { HomeMetierServiceACI } from '.';

@Injectable()
export class HomeMetierService implements HomeMetierServiceACI {
    public refreshToken(data: any) {
        return this.homeRest.refreshToken(data)
        .map(this.extractData)
        .catch(this.handleError);
    }
    public getAllConnectedUsers() {
        return this.homeRest.getAllConnectedUsers()
        .map(this.extractData)
        .catch(this.handleError);
    }
    public removeSearch(search: any) {
        return this.homeRest.removeSearch(search)
        .map(this.extractData)
        .catch(this.handleError);
    }
    public getNbVisiteurAndFavoris() {
        return this.homeRest.getNbVisiteurAndFavoris()
        .map(this.extractData)
        .catch(this.handleError);
    }
    public addDeleteRoleAbonne(action)   {
        return this.homeRest.addDeleteRoleAbonne(action)
            .map(this.extractData)
            .catch(this.handleError);
    }
    public  addOrVerifyPayment(data) {
        return this.homeRest.addOrVerifyPayment(data)
            .map(this.extractData)
            .catch(this.handleError);
    }
    public getAbus() {
        return this.homeRest.getAbus()
            .map(this.extractData)
            .catch(this.handleError);
    }
    public reportAbus(data: any) {
        return this.homeRest.reportAbus(data)
            .map(this.extractData)
            .catch(this.handleError);
    }
    public checkinBlackList(pseudo: string) {
        return this.homeRest.checkinBlackList(pseudo)
            .map(this.extractData)
            .catch(this.handleError);
    }
    public addToBlackList(uid: string) {
        return this.homeRest.addToBlackList(uid)
            .map(this.extractData)
            .catch(this.handleError);
    }

    public removeToBlackList(uid: string) {
        return this.homeRest.removeToBlackList(uid)
            .map(this.extractData)
            .catch(this.handleError);
    }
    public blacklist(uid: string, page: number, size: number) {
        return this.homeRest.blacklist(uid, page, size)
            .map(this.extractData)
            .catch(this.handleError);
    }
    public getSetting() {
        return this.homeRest.getSetting()
            .map(this.extractData)
            .catch(this.handleError);
    }
    public getBlackLlist(pseudo: string) {
        return this.homeRest.getBlackLlist(pseudo)
            .map(this.extractData)
            .catch(this.handleError);
    }
    public getUserSetting(uid: string) {
        return this.homeRest.getUserSetting(uid)
            .map(this.extractData)
            .catch(this.handleError);
    }
    public getCurrentSouscription(uid: string) {
        return this.homeRest.getCurrentSouscription(uid)
            .map(this.extractData)
            .catch(this.handleError);
    }
    public resilierSouscription(data: any) {
       return this.homeRest.resilierSouscription(data)
            .map(this.extractData)
            .catch(this.handleError);
    }
    public renouvelerSouscription(data: any) {
         return this.homeRest.renouvelerSouscription(data)
            .map(this.extractData)
            .catch(this.handleError);
    }
    public subscribeToOffer(data: any) {
         return this.homeRest.subscribeToOffer(data)
            .map(this.extractData)
            .catch(this.handleError);
    }

    constructor(
        private homeRest: HomeRest) { }

    public getOffres(id: any) {
        return this.homeRest.getOffres(id)
            .map(this.extractData)
            .catch(this.handleError);
    }



    private extractData(res: any) {
        let data = res.json();
        return data;
    }
    private handleError(error: any) {
        let errMsg = (error.message) ? error.message :
            error.status ? `${error.status} - ${error.statusText}` : 'server error';
        return Observable.throw(errMsg);
    }
    public rechercheAutocomplete(name : string): Observable<any> {
        return this.homeRest.rechercheAutocomplete(name)
            .map(this.extractData)
            .catch(this.handleError);
    }
    public getHome(): Observable<any> {
        return this.homeRest.getUserConnecte();
    }
    public getFormRecherche(): Observable<Response> {
        return this.homeRest.getFormRecherche()
            .map(this.extractData)
            .catch(this.handleError);
    }
    public getListRecherche(): Observable<Response> {
        return this.homeRest.getListRecherche()
            .map(this.extractData)
            .catch(this.handleError);
    }
    public recherche(data, min, max, order): Observable<Response> {
        return this.homeRest.recherche(data, min, max, order)
            .map(this.extractData)
            .catch(this.handleError);
    }
    public getVisiteur(data, min, max, order): Observable<Response> {
        return this.homeRest.getVisiteur(data, min, max, order)
            .map(this.extractData)
            .catch(this.handleError);
    }

    public getHomes(page: number, size: number): Observable<any> {
        return this.homeRest.getHomes(page, size)
            .map(this.extractData)
            .catch(this.handleError);
    }
    public getUserByCity(page: number, size: number, sortData?: any): Observable<any> {
        return this.homeRest.getUserByCity(page, size, sortData)
            .map(this.extractLeftListData)
            .catch(this.handleError);
    }
    private extractLeftListData(res){
        const data = res.json();
        if(data && data['result'] && Array.isArray(data['result'].value)){
            data['result'].value.forEach(d=>{
                d.codepostal && (d.codepostal = d.codepostal.substring(0,2));               
            });
        }
        return data;
    }
    public getUserConnecte(): Observable<any> {
        return this.homeRest.getUserConnecte()
            .map(this.extractConnectedUserData)
            .catch(this.handleError);
    }
    private extractConnectedUserData(res){
        let data = res.json();
        // ATTENTION : libelleDescription est utilisé uniquement dans front office (Cf moderation texte), dans back office on utilise description
        data.libelleDescription = data.descriptionIsRejected ? '' : data.description;       
        return data;
    }
    public getUserDetail(id: String): Observable<any> {
        return this.homeRest.getUserDetail(id)
            .map(this.extractUserDetail)
            .catch(this.handleError);
    }
    private extractUserDetail(res){
        let data = res.json();
        // ATTENTION : libelleDescription est utilisé uniquement dans front office (Cf moderation texte), dans back office on utilise description        
        data.libelleDescription = data.descriptionIsRejected ? '' : data.description;
        return data;
    }
    public updateProfil(oUser) {
        return this.homeRest.updateProfil(oUser);
    }

    public updatePseudoEmail(pseudo: string, email: string){
        return this.homeRest.updatePseudoEmail(pseudo, email);
    }
    public listePhoto(id: string, _public) {
        return this.homeRest.listePhoto(id, _public)
            .map(this.extractData)
            .catch(this.handleError);
    }
    public ajouterPhoto(oPhoto) {
        return this.homeRest.ajouterPhoto(oPhoto)
        .map(this.extractData)
        .catch(this.handleError);
    }
    public deletePhoto(data) {
        return this.homeRest.deletePhoto(data)
        .map(this.extractData)
        .catch(this.handleError);
    }
    public editerPhotoProfil(data) {
        return this.homeRest.editerPhotoProfil(data);
    }
    public addFavoris(id: string) {
        return this.homeRest.addFavoris(id)
        .map(this.extractData)
        .catch(this.handleError);
    }
    public deleteFavoris(id: string) {
        return this.homeRest.deleteFavoris(id);
    }
    public listeFavoris(uid: string, page: number, size: number, sortData?: any) {
        return this.homeRest.listeFavoris(uid, page, size, sortData)
            .map(this.extractData)
            .catch(this.handleError);

    }
    public create_Search(data) {
        return this.homeRest.create_Search(data);

    }
    public getSouscriptionDetail(id: string) {
        return this.homeRest.getSouscriptionDetail(id)
            .map(this.extractData)
            .catch(this.handleError);
    }
    public getAllSouscription() {
        return null;
    }
    public create_Souscription(data) {
        return null;
    }

    public getUserPdpUid(pseudo: string) {
        return this.homeRest.getUserPdpUid(pseudo)
        .map(this.extractData)
        .catch(this.handleError);
    }

    public getUserPdpUids(pseudos: Array<string>) {
        return this.homeRest.getUserPdpUids(pseudos)
        .map(this.extractData)
        .catch(this.handleError);
    }

    public getUserPdpPseudos(uids: Array<string>) {
        return this.homeRest.getUserPdpPseudos(uids)
        .map(this.extractData)
        .catch(this.handleError);
    }

    public getListGestionNotification(): Observable<any> {
        return this.homeRest.getListGestionNotification()
        .map(this.extractData)
        .catch(this.handleError);
    }

    public editStatutNotification(gestion){
        return this.homeRest.editStatutNotification(gestion)
        .map(this.extractData)
        .catch(this.handleError);
    }

    public createOffre(data){
         return this.homeRest.createOffre(data)
            .map(this.extractData)
            .catch(this.handleError);
    }

    public updateOffre(data){
        return this.homeRest.updateOffre(data)
            .map(this.extractData)
            .catch(this.handleError);
    }

    public subscribeNewsletter(uid, checked){
         return this.homeRest.subscribeNewsletter(uid, checked)
            .map(this.extractData)
            .catch(this.handleError);
    }
    public addOrUpdateCodesPromo(data){
        return this.homeRest.addOrUpdateCodesPromo(data)
            .map(this.extractData)
            .catch(this.handleError);
    }
    public getListCodesPromo(data){
        return this.homeRest.getListCodesPromo(data)
            .map(this.extractData)
            .catch(this.handleError);
    }
    public getDetailCodesPromo(data){
        return this.homeRest.getDetailCodesPromo(data)
            .map(this.extractData)
            .catch(this.handleError);
    }


}
