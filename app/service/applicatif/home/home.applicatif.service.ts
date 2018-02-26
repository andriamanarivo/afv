import { Injectable } from '@angular/core';
import { HomeApplicatifServiceACI } from '.';
import { HomeMetierServiceACI } from '../../metier/home';
import { HomeMetierService } from '../../metier/home';
import { Home } from '../../../donnee/home';
import { MySouscription } from '../../../donnee/home/mock-mysouscription';
import { ListeSouscription } from '../../../donnee/home/mock-listeSouscription';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class HomeApplicatifService implements HomeApplicatifServiceACI {
    public refreshToken(data: any) {
        return this.homeMetierServiceACI.refreshToken(data);
    }
    public getAllConnectedUsers() {
        return this.homeMetierServiceACI.getAllConnectedUsers();
    }
    public removeSearch(search: any) {
        return this.homeMetierServiceACI.removeSearch(search);
    }
    public getNbVisiteurAndFavoris() {
        return this.homeMetierServiceACI.getNbVisiteurAndFavoris();
    }
    public  addDeleteRoleAbonne(action){
        return this.homeMetierServiceACI.addDeleteRoleAbonne(action);
    }
    public addOrVerifyPayment(data){
        return this.homeMetierServiceACI.addOrVerifyPayment(data);
    }
    public getAbus() {
        return this.homeMetierServiceACI.getAbus();
    }
    public reportAbus(data: any) {
       return this.homeMetierServiceACI.reportAbus(data);
    }
    public checkinBlackList(pseudo: string) {
        return this.homeMetierServiceACI.checkinBlackList(pseudo);
    }
    public addToBlackList(uid: string) {
         return this.homeMetierServiceACI.addToBlackList(uid);
    }
    public removeToBlackList(uid: string) {
        return this.homeMetierServiceACI.removeToBlackList(uid);
   }
    public blacklist(uid: string, page: number, size: number) {
       return this.homeMetierServiceACI.blacklist(uid, page, size);
    }
    public getSetting() {
        return this.homeMetierServiceACI.getSetting();
    }
    public getBlackLlist(pseudo: string) {
         return this.homeMetierServiceACI.getBlackLlist(pseudo);
    }
    public getUserSetting(uid: string) {
       return this.homeMetierServiceACI.getUserSetting(uid);
    }
    public getCurrentSouscription(uid: string) {
        return this.homeMetierServiceACI.getCurrentSouscription(uid);
    }

    constructor(private homeMetierServiceACI: HomeMetierServiceACI,
        private homeMetierService: HomeMetierService
    ) { }

    public renouvelerSouscription(data: any) {
        return this.homeMetierServiceACI.renouvelerSouscription(data);
    }
    public resilierSouscription(data: any) {
        return this.homeMetierServiceACI.resilierSouscription(data);
    }
    public subscribeToOffer(data: any){
         return this.homeMetierServiceACI.subscribeToOffer(data);
    }
    public rechercheAutocomplete(name : string): Observable<any> {
        if (!name || name == ""){
            return Observable.of([]);
        } else {
            name = name.toLowerCase();
            return this.homeMetierServiceACI.rechercheAutocomplete(name);
        }
        // if(!name || name == "") name = "nothing"
        // else name = name.toLowerCase();
        // return this.homeMetierServiceACI.rechercheAutocomplete(name);
    }
    public getFormRecherche() {
        return this.homeMetierServiceACI.getFormRecherche();
    }
    public getListRecherche() {
        return this.homeMetierServiceACI.getListRecherche();
    }
    public  recherche(data, min, max, order){
        return this.homeMetierServiceACI.recherche(data, min, max, order);
    }
    public  getVisiteur(data, min, max, order){
        return this.homeMetierServiceACI.getVisiteur(data, min, max, order);
    }

    public getHome(id: number) {
        //return this.homeMetierServiceACI.getHome(id);
    }
    public getHomes(page: number, size: number) {
        return this.homeMetierServiceACI.getHomes(page, size);

    }
    public getUserByCity(page: number, size: number, sortData?: any) {
        return this.homeMetierServiceACI.getUserByCity(page, size, sortData);
    }
    public getUserConnecte() {
        return this.homeMetierService.getUserConnecte();
    }
    public getUserDetail(id: String) {
        return this.homeMetierService.getUserDetail(id);
    }
    public updateProfil(oUser) {
        console.log("propo", oUser);
        return this.homeMetierService.updateProfil(oUser);
    }

    public updatePseudoEmail(pseudo: string, email: string){
        return this.homeMetierService.updatePseudoEmail(pseudo, email);
    }
    public listePhoto(id: string, _public) {
        return this.homeMetierService.listePhoto(id, _public);
    }
    public ajouterPhoto(oPhoto) {
        return this.homeMetierService.ajouterPhoto(oPhoto);
    }
    public deletePhoto(data) {
        return this.homeMetierService.deletePhoto(data);
    }
    public editerPhotoProfil(data) {
        return this.homeMetierService.editerPhotoProfil(data);
    }
    public addFavoris(id: string) {
        return this.homeMetierService.addFavoris(id);
    }
    public deleteFavoris(id: string) {
        return this.homeMetierService.deleteFavoris(id);
    }
    public listeFavoris(uid: string, page: number, size: number, sortData?: any) {
        return this.homeMetierService.listeFavoris(uid, page, size, sortData);
    }
    public create_Search(data) {
        return this.homeMetierService.create_Search(data);
    }
    public getAllSouscription() {
        //return this.homeMetierService.getAllSouscription();
        return Observable.of(ListeSouscription);
    }
    public getSouscriptionDetail(id: string) {
        return this.homeMetierServiceACI.getSouscriptionDetail(id);
    }
    public create_Souscription(data) {
        return this.homeMetierService.create_Souscription(data);
    }
    public getOffres(id: any){
        return this.homeMetierServiceACI.getOffres(id);
    }

    public getUserPdpUid(pseudo: string) {
        return this.homeMetierServiceACI.getUserPdpUid(pseudo);
    }

    public getUserPdpUids(pseudos: Array<string>) {
        return this.homeMetierServiceACI.getUserPdpUids(pseudos);
    }
    public getUserPdpPseudos(uids: Array<string>) {
        return this.homeMetierServiceACI.getUserPdpPseudos(uids);
    }

    public getListGestionNotification(){
        return this.homeMetierServiceACI.getListGestionNotification();
    }

    public editStatutNotification(gestion){
        return this.homeMetierServiceACI.editStatutNotification(gestion);
    }

    public createOffre(data){
        return this.homeMetierServiceACI.createOffre(data);
    }

    public updateOffre(data){
        return this.homeMetierServiceACI.updateOffre(data);
    }

    public subscribeNewsletter(uid, checked){
        return this.homeMetierServiceACI.subscribeNewsletter(uid, checked);
    }
    public addOrUpdateCodesPromo(data){
        return this.homeMetierServiceACI.addOrUpdateCodesPromo(data);
    }
    public getListCodesPromo(data){
        return this.homeMetierServiceACI.getListCodesPromo(data);
    }
    public getDetailCodesPromo(data){
        return this.homeMetierServiceACI.getDetailCodesPromo(data);
    }

}
