import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { HomeMetierServiceACI } from '.';
import { Home } from '../../../donnee/home/home';
import { UserLeft } from '../../../donnee/home/mock-userLeft';
import { HomeCenter } from '../../../donnee/home/mock-homeCenter';
import { UserProfil } from '../../../donnee/home/mock-userProfil';

@Injectable()
export class HomeMetierServiceMock implements HomeMetierServiceACI {
    public refreshToken(data: any) {
        throw new Error("Method not implemented.");
    }
    public getAllConnectedUsers() {
        throw new Error("Method not implemented.");
    }
    public removeSearch(search: any) {
        throw new Error("Method not implemented.");
    }
    public getNbVisiteurAndFavoris() {
        throw new Error('Method not implemented.');
    }
    public addDeleteRoleAbonne(action){
        throw new Error('Method not implemented.');
    }
    public  addOrVerifyPayment(data) {
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
    public rechercheAutocomplete(name: string) {
        return null;
    }
    public getFormRecherche() {
        return null;
    }
    public getListRecherche() {
        return null;
    }
    public recherche(data, min, max, order) {
        return null;
    }
    public getVisiteur(data, min, max, order) {
        return null;
    }

    public getHome(id: number) {
       return Observable.of(UserLeft);

    }
    public  getHomes(page:number, size:number){
        return Observable.of(HomeCenter);
    }     

    public  getUserByCity(page:number, size:number, sortData?: any){
       // return Promise.resolve(UserLeft);
       return Observable.of(UserLeft);
    }

    public  getUserDetail(id: String){
        return Observable.of(UserProfil);
    }

     public getUserConnecte(){
        return Observable.of(UserProfil);
    }

     public updateProfil(oUser){
        return null;
    }
    public listePhoto(id:string, _public){
        return null;
    }
    public  ajouterPhoto(oPhoto){
        return null;
    }
    public  deletePhoto(data){
        return null;
    }

    public  editerPhotoProfil(data){
        return null;
    }

     public addFavoris(id:string){
        return null;
    }

     public deleteFavoris(id:string){
        return null;
    }

    public  listeFavoris(uid: string, page: number, size: number, sortData?: any){
         return null;
    }
    public  create_Search(data){
         return null;
    }

    public getSouscriptionDetail(id: string){
        return null;
    }

    public  getAllSouscription(){
         return null;
    }
    public  create_Souscription(data){
         return null;
    }

    public  updatePseudoEmail(pseudo: string, email: string) {
        return null;
    }

    public getUserPdpUid(pseudo: string) {
        throw new Error('Method not implemented.');
    }

    public getUserPdpUids(pseudos: Array<string>) {
        throw new Error('Method not implemented.');
    }

    public getUserPdpPseudos(uids: Array<string>) {
        throw new Error('Method not implemented.');
    }

    public getListGestionNotification() {
        return null;
    }

    public editStatutNotification(gestion) {
        return null;
    }

    public updateOffre(data: any) {
         throw null;
    }

    public createOffre(data: any) {
        return null;
    }

    public subscribeNewsletter(uid: string, checked: boolean) {
         return null;
    }

    public addOrUpdateCodesPromo(data){
        return null;
    }

    public getListCodesPromo(data){
        return null;
    }

    public getDetailCodesPromo(data){
        return null;
    }


}
