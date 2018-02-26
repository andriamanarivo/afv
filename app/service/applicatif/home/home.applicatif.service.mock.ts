import { Injectable } from '@angular/core';
import { HomeApplicatifServiceACI } from '.';
import { HomeMetierServiceMock } from '../../metier/home/home.metier.service.mock';
import { HomeMetierServiceACI } from '../../metier/home';
//import { Home, Homes } from '../../../donnee/home';
import { Home } from '../../../donnee/home';
import { UserLeft } from '../../../donnee/home/mock-userLeft';
import { HomeCenter } from '../../../donnee/home/mock-homeCenter';
import { UserProfil } from '../../../donnee/home/mock-userProfil';
import {MySouscription} from '../../../donnee/home/mock-mysouscription';
import {ListeSouscription} from '../../../donnee/home/mock-listeSouscription';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class HomeApplicatifServiceMock implements HomeApplicatifServiceACI {
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
    public  addDeleteRoleAbonne(action){
        throw new Error('Method not implemented.');
    }
    public  addOrVerifyPayment(data){

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
    public getOffres(id: any) {
        throw new Error('Method not implemented.');
    }
    public getCurrentSouscription(uid: string) {
        throw new Error('Method not implemented.');
    }
    public renouvelerSouscription(id: string) {
        throw new Error('Method not implemented.');
    }
    public subscribeToOffer(id: string) {
        throw new Error('Method not implemented.');
    }
    public resilierSouscription(id: string) {
        throw new Error('Method not implemented.');
    }
    public rechercheAutocomplete(name){
        return null;
    }
    public getFormRecherche() {
        return null;
    }
    public getListRecherche() {
        return null;
    }
    public  recherche(data, min, max, order) {
        return null;
    }
    public  getVisiteur(data, min, max, order) {
        return null;
    }
    public getHome(id: number) {
    }
    public getHomes(page: number, size: number) {
        return Observable.of(HomeCenter);
    }
    public getUserByCity(page: number, size: number, sortData?: any) {
       return Observable.of(UserLeft);

    }
    public   getUserDetail(id: String) {
        return Observable.of(UserProfil);
    }
    public   getUserConnecte() {
        return Observable.of(UserProfil);
    }

    public updateProfil(oUser) {
        return null;
    }
    public listePhoto(id: string, _public) {
        return null;
    }
    public ajouterPhoto(oPhoto) {
        return null;
    }
    public deletePhoto(data) {
        return null;
    }
    public editerPhotoProfil(data) {
        return null;
    }
   public   addFavoris(id: string) {
        return null;
    }
    public   deleteFavoris(id: string) {
        return null;
    }
    public  listeFavoris(uid: string, page: number, size: number, sortData?: any) {
        return null;
    }
    public  create_Search(data) {
        return null;
    }
    public  getAllSouscription() {
        console.log('souscript', ListeSouscription);
        return Observable.of(ListeSouscription);
    }
    public  getSouscriptionDetail(id: string) {
       return Observable.of(MySouscription);
    }
    public  create_Souscription(data) {
        return null;
    }

    public getSouscriptionDatas(id: string) {
        return null;
    }

    public updatePseudoEmail(pseudo: string, email: string) {
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
        throw new Error('Method not implemented.');
    }

    public editStatutNotification(gestion) {
        throw new Error('Method not implemented.');
    }

    public createOffre(data: any) {
        throw new Error('Method not implemented.');
    }

    public updateOffre(data: any) {
        throw new Error('Method not implemented.');
    }

    public subscribeNewsletter(uid: string, checked: boolean) {
        throw new Error('Method not implemented.');
    }
    public addOrUpdateCodesPromo(data){
        throw new Error('Method not implemented.');
    }
    public getListCodesPromo(data){
        throw new Error('Method not implemented.');
    }
    public getDetailCodesPromo(data){
        throw new Error('Method not implemented.');
    }

}
