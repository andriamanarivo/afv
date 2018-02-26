import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
// import 'rxjs/Rx';

import { AdministrationApplicatifServiceACI } from '.';
import { AdministrationMetierServiceACI} from '../../metier/administration/administration.metier.service.aci';

@Injectable()
export class AdministrationApplicatifService implements AdministrationApplicatifServiceACI {
    public editPhoto(data: any) {
        return this.administrateurMetierService
        .editPhoto(data);
    }
    public getUserNotFound() {
        return this.administrateurMetierService
        .getUserNotFound();
    }
    public acceptDescription(id: any) {
        return this.administrateurMetierService
        .acceptDescription(id);
    }
    public getNbFileMigration(data) {
        return this.administrateurMetierService
        .getNbFileMigration(data);
    }
    public getNameFileMigration(data: any) {
        return this.administrateurMetierService
        .getNameFileMigration(data);
    }
    public getSqlData(data: any) {
        return this.administrateurMetierService
        .getSqlData(data);
    }
    public executeImport(data) {
        return this.administrateurMetierService
        .executeImport(data);
    }
    public changeStatutModerationDescription(uid: any) {
        return this.administrateurMetierService
        .changeStatutModerationDescription(uid);
    }
    public rejectDescription(id: any) {
        return this.administrateurMetierService
        .rejectDescription(id);
    }
    public getDescriptions(criteria: any) {
        return this.administrateurMetierService
        .getDescriptions(criteria);
    }
    public changeScopePhoto(idPhoto: any) {
        return this.administrateurMetierService
        .changeScopePhoto(idPhoto);
    }
    public changeStatutModerationPhoto(idPhoto: any) {
        return this.administrateurMetierService
        .changeStatutModerationPhoto(idPhoto);
    }
    public getPhotos(criteria: any) {
        return this.administrateurMetierService
        .getPhotos(criteria);
    }
    public deleteUser(id: any){
        return this.administrateurMetierService
            .deleteUser(id);
    }
    public performAction(data: any) {
        return this.administrateurMetierService
            .performAction(data);
    }
    public getDetailAbus(uid: string) {
         return this.administrateurMetierService
            .getDetailAbus(uid);
    }
    public listAbus(page: number, size: number, filtre:any) {
        return this.administrateurMetierService
            .listAbus(page, size, filtre);
    }
    authtoken: string;
    constructor(
        private administrateurMetierService : AdministrationMetierServiceACI
        ) {}

    public getThematiques() {
        return this.administrateurMetierService
            .getThematiques();
    }
    public addUpdateThematique(thematique) {
        return this.administrateurMetierService
            .addUpdateThematique(thematique);
    }
    public deleteThematique(uid) {
        return this.administrateurMetierService
            .deleteThematique(uid);
    }
    public getCouleur() {
        return this.administrateurMetierService
            .getCouleur();
    }
    public addUpdateCouleur(couleur) {
        return this.administrateurMetierService
            .addUpdateCouleur(couleur);
    }
    public deleteCouleur(uid) {
        return this.administrateurMetierService
            .deleteCouleur(uid);
    }

    public listAbonnement(page: number, size: number) {
        return this.administrateurMetierService
            .listAbonnement(page, size);
    }

    public   newAbonnement(uid){
        return this.administrateurMetierService
            .newAbonnement(uid);
    }

    public   suspendAbonnent(uid){
        return this.administrateurMetierService
            .suspendAbonnent(uid);
    }

    public reprendreAbonnement(uid){
        return this.administrateurMetierService
            .reprendreAbonnement(uid);
    }

    public listTerme(page,size){
         return this.administrateurMetierService
            .listTerme(page,size);
    }
    public listTermes(){
        return this.administrateurMetierService
           .listTermes();
   }

    public createTerme(data){
        return this.administrateurMetierService
            .createTerme(data);
    }

    public deleteTerme(idTerme){
        return this.administrateurMetierService
            .deleteTerme(idTerme);
    }

    public updateTerme(data){
        return this.administrateurMetierService
            .updateTerme(data);
    }

    public getSubscribedNewsletter(){
        return this.administrateurMetierService
            .getSubscribedNewsletter();
    }

    public stopAbonnement(id){
         return this.administrateurMetierService
            .stopAbonnement(id);
    }
    
}
