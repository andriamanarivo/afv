import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
// import 'rxjs/Rx';

import { AdministrationRest} from '../../rest/administration/administration.rest';

import { AdministrationMetierServiceACI } from '.';
import { AppConfig } from 'app/contrainte/config/_app/app.config';

@Injectable()
export class AdministrationMetierService implements AdministrationMetierServiceACI {
    public editPhoto(data: any) {
        return this.administrationRest.editPhoto(data)
        .map(res=>{return this.extractPhotoAfterEdit(res, this);})
        .catch(this.handleError);
    }

    extractPhotoAfterEdit(res: any, me: any){
        let data = res.json();
        // if(data && data.length  &&  data.length !== 0){
        //     data = me.baseUrl + data;
        // }
        return data;
    }

    // assets/file_uploaded/moderation_b639ff06555af3b12403c8399da4df1d.jpg
    
   
    public getNbFileMigration(data) {
        return this.administrationRest.getNbFileMigration(data)
        .map(this.extractData)
        .catch(this.handleError);
    }
    public getNameFileMigration(data: any) {
        return this.administrationRest.getNameFileMigration(data)
        .map(this.extractData)
        .catch(this.handleError);
    }
   
   
  
  
   
    baseUrl: any;

    constructor(
        private administrationRest : AdministrationRest,
        private appConfig: AppConfig) { 
        this.baseUrl = this.appConfig.getConfig('baseUrlAppUrl').replace('/app_dev.php', '');
    }

    public getUserNotFound() {
        return this.administrationRest.getUserNotFound()
        .map(this.extractData)
        .catch(this.handleError);
    }

    public getSqlData(data: any) {
        return this.administrationRest.getSqlData(data)
        .map(this.extractData)
        .catch(this.handleError);
    }

    public executeImport(data) {
        return this.administrationRest.executeImport(data)
        .map(this.extractData)
        .catch(this.handleError);
    }

    public changeStatutModerationDescription(uid: any) {
        return this.administrationRest.changeStatutModerationDescription(uid)
        .map(this.extractData)
        .catch(this.handleError);
    }

    public acceptDescription(id: any) {
        return this.administrationRest.acceptDescription(id)
        .map(this.extractData)
        .catch(this.handleError);
    }
   

    public rejectDescription(id: any) {
        return this.administrationRest.rejectDescription(id)
            .map(this.extractData)
            .catch(this.handleError);
    }
   

    public getDescriptions(criteria: any) {
        return this.administrationRest.getDescriptions(criteria)
            .map(this.extractData)
            .catch(this.handleError);
    }

    public changeScopePhoto(idPhoto: any) {
        return this.administrationRest.changeScopePhoto(idPhoto)
        .map(this.extractData)
        .catch(this.handleError);
    }

    public changeStatutModerationPhoto(idPhoto: any) {
        return this.administrationRest.changeStatutModerationPhoto(idPhoto)
            .map(this.extractData)
            .catch(this.handleError);
    }

    public getPhotos(criteria: any) {
        return this.administrationRest.getPhotos(criteria)
        .map(res=>{return this.extractPhotosdata(res, this);})
        .catch(this.handleError);
    }
    extractPhotosdata(res: any, me: any){
        let data = res.json();
        console.log(data);
        if (data['photos'] && data['photos'].length !== 0) {
            data['photos'].forEach(photo => {
                photo.url = photo.uri;
                photo.uri = me.baseUrl + photo.uri.replace('file_uploaded/', 'file_uploaded/square_320_');
            });
            console.log(data);
        }
        return data;
    }
    public deleteUser(id: any){
        return this.administrationRest.deleteUser(id)
            .map(this.extractData)
            .catch(this.handleError);
    }
    public performAction(data: any) {
         return this.administrationRest.performAction(data)
            .map(this.extractData)
            .catch(this.handleError);
    }
    public getDetailAbus(uid: string) {
        return this.administrationRest.getDetailAbus(uid)
            .map(this.extractData)
            .catch(this.handleError);
    }
    public listAbus(page: number, size: number, filtre:any) {
        return this.administrationRest.listAbus(page, size, filtre)
            .map(this.extractData)
            .catch(this.handleError);
    }

   
    public getThematiques() : Observable<any>  {
        return this.administrationRest.getThematiques()
            .map(this.extractData)
            .catch(this.handleError);
            
    }
    public addUpdateThematique(thematique){
        return this.administrationRest.addUpdateThematique(thematique);
    }
    public deleteThematique(uid) {
        return this.administrationRest.deleteThematique(uid)
            .map(this.extractData)
            .catch(this.handleError);
    }
    public getCouleur() {
        return this.administrationRest.getCouleur()
            .map(this.extractData)
            .catch(this.handleError);
    }
    public addUpdateCouleur(couleur) {
        return this.administrationRest.addUpdateCouleur(couleur);
    }
    public deleteCouleur(uid) {
        return this.administrationRest.deleteCouleur(uid)
            .map(this.extractData)
            .catch(this.handleError);
    }


    private extractData(res: any) {
            let data = res.json();
            return data;
    }

    private handleError(error: any) {
        return Observable.throw(error);
    }

    public listAbonnement(page: number, size: number) {
        return this.administrationRest.listAbonnement(page, size)
            .map(this.extractData)
            .catch(this.handleError);
    }

    public   newAbonnement(uid){
        return this.administrationRest.newAbonnement(uid)
            .map(this.extractData)
            .catch(this.handleError);
    }

    public   suspendAbonnent(uid){
        return this.administrationRest.suspendAbonnent(uid)
            .map(this.extractData)
            .catch(this.handleError);
    }

    public reprendreAbonnement(uid){
        return this.administrationRest.reprendreAbonnement(uid)
            .map(this.extractData)
            .catch(this.handleError);
    }

    public listTerme(page,size){
        return this.administrationRest.listTerme(page,size)
            .map(this.extractData)
            .catch(this.handleError);
    }

    public listTermes() {
        return this.administrationRest.listTermes()
            .map(this.extractData)
            .catch(this.handleError);
    }

    public createTerme(data){
         return this.administrationRest.createTerme(data)
            .map(this.extractData)
            .catch(this.handleError);
    }

    public deleteTerme(idTerme){
        return this.administrationRest.deleteTerme(idTerme)
            .map(this.extractData)
            .catch(this.handleError);
    }

    public updateTerme(data){
        return this.administrationRest.updateTerme(data)
            .map(this.extractData)
            .catch(this.handleError);
    }

    public getSubscribedNewsletter(){
        return this.administrationRest.getSubscribedNewsletter()
            .map(this.extractData)
            .catch(this.handleError);
    }

    public stopAbonnement(id){
        return this.administrationRest.stopAbonnement(id)
            .map(this.extractData)
            .catch(this.handleError);
    }

}
