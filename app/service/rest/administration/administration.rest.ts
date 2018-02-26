import { Injectable, Inject } from '@angular/core';
//import { Headers, Http, Response, RequestOptions} from '@angular/http';
import { AuthHttp} from 'angular2-jwt';

import { Observable } from 'rxjs/Observable';

import { AppConfig }       from '../../../contrainte/config/_app/app.config';

import { environment } from '../../../../environments/environment';
import { Http } from '@angular/http';

@Injectable()
export class AdministrationRest {


    baseUrlApp: string;
    thematiqueUrl: string;
    colorsUrl: string;

    idSite: string;
    constructor(
        private authHttp: AuthHttp,
        private http:Http,
        private appConfig : AppConfig
    ) {
        this.thematiqueUrl = this.appConfig.getConfig('thematiquesUrl');
        this.colorsUrl = this.appConfig.getConfig('colorsUrl');
        //this.baseUrlApp = this.appConfig.getConfig("baseUrlAppUrl");
        this.baseUrlApp = environment.baseUrlAppUrl;
    }

   
    getUserNotFound(){
        return this.http.get(this.baseUrlApp + 'getUserNotFound');
    }

    getNbFileMigration(data){
        return this.http.post(this.baseUrlApp + 'getNbTotalFiles', data);
    }

    getNameFileMigration(data){
        return this.http.post(this.baseUrlApp + 'getNameFileMigration?max='+data.max+'&first='+ data.first, data);
    }

    getSqlData(data){
        // ?max='+data.max+'&first='+ data.first
        return this.http.post(this.baseUrlApp + 'getSqlData', data);
    }

    executeImport(data){
        return this.http.post(this.baseUrlApp + 'executeImport', data);
    }

    acceptDescription(id){
        const url = this.baseUrlApp + 'api/admin/' + id + '/acceptDescription';
        return this.authHttp.get(url);
    }

    rejectDescription(id){
        const url = this.baseUrlApp + 'api/admin/' + id + '/rejectDescription';
        return this.authHttp.get(url);
    }

    getDescriptions(criteria){
        const url = this.baseUrlApp + 'api/mod/description';
        return this.authHttp.post(url, criteria);
    }

    editPhoto(data){
        const url = this.baseUrlApp + 'api/create_img_custum';
        return this.authHttp.post(url, data);
    }


    changeScopePhoto(idPhoto){
        const url = this.baseUrlApp + 'api/' +idPhoto + '/changeScope';
        return this.authHttp.get(url);
    }

    changeStatutModerationDescription(uid){
        const url = this.baseUrlApp + 'api/' + uid + '/changeMod';
        return this.authHttp.get(url);
    }

    changeStatutModerationPhoto(idPhoto){
        const url = this.baseUrlApp + 'api/' +idPhoto + '/changeMod';
        return this.authHttp.get(url);
    }

    deleteUser(id: any) {
        const url = this.baseUrlApp + 'api/admin/utilisateur/supprimer';
        return this.authHttp.post(url, id);
    }

    getPhotos(criteria: any) {
        criteria.max = JSON.parse(criteria.max);
        const url = this.baseUrlApp + 'api/mod/photos';
        return this.authHttp.post(url, criteria);
    }


    getThematiques() {
        const thematiquesUrl = this.baseUrlApp  +'api/'+this.thematiqueUrl;
        return this.authHttp.get(thematiquesUrl);
    }
    addUpdateThematique(thematique) {
        const thematiquesUrl = this.baseUrlApp  + 'api/admin/addUpdateThematique';

        return this.authHttp.post(thematiquesUrl, thematique);
    }
    deleteThematique(uid) {
        const thematiquesUrl = this.baseUrlApp  + 'api/admin/deleteThematique/' + uid;

        return this.authHttp.get(thematiquesUrl);
    }

    getCouleur() {
        const colorsUrl = this.baseUrlApp  + 'api/' + this.colorsUrl;
        return this.authHttp.get(colorsUrl);
    }
    addUpdateCouleur(couleur) {
        const colorsUrl = this.baseUrlApp  + 'api/admin/addUpdateColor';

        return this.authHttp.post(colorsUrl, couleur) ;
    }
    deleteCouleur(uid) {
        const colorsUrl = this.baseUrlApp + 'api/admin/deleteColor/' + uid;
        return this.authHttp.get(colorsUrl);
    }

    listAbus(page: number, size: number, filtre:any){
        const abusUrl = this.baseUrlApp + 'api/admin/allListAbus';
        return this.authHttp.post(abusUrl,filtre);
    }

    getDetailAbus(uid:string){
        const url = this.baseUrlApp + 'api/'+ uid +'/editAbus';
        return this.authHttp.get(url);
    }

    updateAbus(abus: any){
        const url = this.baseUrlApp + 'api/addUpdateAbus';
        return this.authHttp.post(url, abus);
    }

    performAction(data:any){
        console.log(data);
        const url =  this.baseUrlApp + 'api/actionStatutAbus';
        return this.authHttp.post(url, data);
    }

    listAbonnement(page: number, size: number){
        const abonnementUrl = this.baseUrlApp + 'api/admin/listAbonne?first=' + page + '&max=' + size;

        return this.authHttp.get(abonnementUrl);
    }

    newAbonnement(uid){
        const url =  this.baseUrlApp + 'api/admin/renouveleAbonne';
        const data={id:uid};
        return this.authHttp.post(url, data);
    }

    suspendAbonnent(uid){
        const url =  this.baseUrlApp + 'api/admin/suspendreAbonne';
        const data ={id:uid};
        return this.authHttp.post(url, data);
    }

    reprendreAbonnement(uid){
        const url =  this.baseUrlApp + 'api/admin/reprendreAbonne';
        const data ={id:uid};
        return this.authHttp.post(url, data);
    }

    listTerme(page,size){
        const termeUrl = this.baseUrlApp + 'api/term/all/'+page+'/' + size;
        return this.authHttp.get(termeUrl);
    }
    listTermes(){
        const termeUrl = this.baseUrlApp + 'term/all';
        return this.authHttp.get(termeUrl);
    }

    createTerme(data){
        const url =  this.baseUrlApp + 'api/term/create';
        return this.authHttp.post(url, data);
    }

    deleteTerme(idTerme){
        const url =  this.baseUrlApp + 'api/term/delete';
        const data ={id:idTerme};
        return this.authHttp.post(url, data);
    }

    updateTerme(data){
        const url =  this.baseUrlApp + 'api/term/update';
        return this.authHttp.post(url, data);
    }

    getSubscribedNewsletter(){
         const Url = this.baseUrlApp + 'api/newsletter/subscribed/users.csv'
         return this.authHttp.get(Url);
    }

    stopAbonnement(id){
        const url =  this.baseUrlApp + 'api/admin/stopAbonne';
        const data = {id: id};
        return this.authHttp.post(url, data);
    }
}