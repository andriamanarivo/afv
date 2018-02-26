import { Injectable } from '@angular/core';
import { SiteDto, SiteDo, LibelleDroits } from '../../../donnee/site';

@Injectable()
export class SiteFactory {
    constructor() { }

    siteDtoFromDo(siteDo): SiteDto {
        const allDroits = siteDo.roleDroit;
        const listeProfils = allDroits.filter(droit => droit.etape === 'a4uid');
        const droitListeProfils = this.pivotDroits(listeProfils, 'a4uid');

        const rechercheProfils = allDroits.filter(droit => droit.etape === 'a11uid');
        const droitRechercheProfils = this.pivotDroits(rechercheProfils, 'a11uid');

        const chat = allDroits.filter(droit => droit.etape === 'a25uid');
        const droitChat = this.pivotDroits(chat, 'a25uid');

        const profil = allDroits.filter(droit => droit.etape === 'a33uid');
        const droitProfil = this.pivotDroits(profil, 'a33uid');

        const accountSettings = allDroits.filter(droit => droit.etape === 'a44uid');
        const droitAccountSettings = this.pivotDroits(accountSettings, 'a44uid');

        const favorisAncAmis = allDroits.filter(droit => droit.etape === 'a50uid');
        const droitFavorisAncAmis = this.pivotDroits(favorisAncAmis, 'a50uid');

        const visiteurs = allDroits.filter(droit => droit.etape === 'a54uid');
        const droitVisiteurs = this.pivotDroits(visiteurs, 'a54uid');

        const blacklist = allDroits.filter(droit => droit.etape === 'a58uid');
        const droitBlacklist = this.pivotDroits(blacklist, 'a58uid');

        const notificationsEmail = allDroits.filter(droit => droit.etape === 'a63uid');
        const droitNotificationsEmail = this.pivotDroits(notificationsEmail, 'a63uid');

        const affichagePublicite = allDroits.filter(droit => droit.etape === 'a71uid');
        const droitAffichagePublicite = this.pivotDroits(affichagePublicite, 'a71uid');

        const sondages = allDroits.filter(droit => droit.etape === 'a77uid');
        const droitSondages = this.pivotDroits(sondages, 'a77uid');

        const petitesAnnonces = allDroits.filter(droit => droit.etape === 'a80uid');
        const droitPetitesAnnonces = this.pivotDroits(petitesAnnonces, 'a80uid');

        const confessionnal = allDroits.filter(droit => droit.etape === 'a88uid');
        const droitConfessionnal = this.pivotDroits(confessionnal, 'a88uid');

        // -----------------------------------------
        const journalPageEvent = allDroits.filter(droit => droit.etape === 'a116uid');
        const droitJournalPageEvent = this.pivotDroits(journalPageEvent, 'a116uid');

        const visioChat = allDroits.filter(droit => droit.etape === 'a120uid');
        const droitVisioChat = this.pivotDroits(visioChat, 'a120uid');

        const resultatRecherche = allDroits.filter(droit => droit.etape === 'a123uid');
        const droitResultatRecherche = this.pivotDroits(resultatRecherche, 'a123uid');

        const slogan: any = {};
        slogan.slogan = siteDo.section.slogan;
        slogan.logo = siteDo.section.logo;
        slogan.description = siteDo.section.description;
        slogan.telephoneClient = siteDo.section.telephoneClient;
        slogan.mailClient = siteDo.section.mailClient;
        slogan.telephoneAdmin = siteDo.section.telephoneAdmin;
        slogan.mailAdmin = siteDo.section.mailAdmin;
        slogan.telephoneModerateur = siteDo.section.telephoneModerateur;
        slogan.mailModerateur = siteDo.section.mailModerateur;
        slogan.mailSite = siteDo.section.mailSite;
        slogan.telephoneSite = siteDo.section.telephoneSite;
        slogan.sms = siteDo.section.sms;

        const point: any = {};

        point.pointAge = siteDo.section.pointAge;
        point.pointDistance = siteDo.section.pointDistance;
        point.pointRencontre = siteDo.section.pointRencontre;
        point.pointPhotos = siteDo.section.pointPhotos;
        point.pointTendance = siteDo.section.pointTendance;

        const timer: any = {};
        timer.tempConfCompte = siteDo.section.tempConfCompte;
        timer.tempDesactiveUser = siteDo.section.tempDesactiveUser;
        timer.tempSuspensionUser = siteDo.section.tempSuspensionUser;
        timer.tempInactiveUser = siteDo.section.tempInactiveUser;

        return new SiteDto(
            siteDo.idSite,
            siteDo.siteName,
            siteDo.idThematique,
            siteDo.color,
            droitListeProfils,
            droitRechercheProfils,
            droitChat, droitProfil,
            droitAccountSettings,
            droitFavorisAncAmis,
            droitVisiteurs,
            droitBlacklist,
            droitNotificationsEmail,
            droitAffichagePublicite,
            droitSondages,
            droitPetitesAnnonces,
            droitConfessionnal,
            droitJournalPageEvent,
            droitVisioChat,
            droitResultatRecherche,
            point,
            timer,
            slogan
        );
    }

    pivotRoles(droits: any) {
        const result = droits.reduce((prev, curr) => {
            if (curr.abonne) {
                const tranformed = this.creerDroit(curr, 'abouid');
                prev.push(tranformed);
            }

            /* if (curr.administrateur) {
                let tranformed = this.creerDroit(curr, "admuid")
                prev.push(tranformed);
            } */

            /* if (curr.moderateur) {
                let tranformed = this.creerDroit(curr, "moduid")
                prev.push(tranformed);
            } */

            /* if (curr.visiteur) {
                let tranformed = this.creerDroit(curr, "visuid")
                prev.push(tranformed);
            } */


            if (curr.visiteurHomme) {
                const tranformed = this.creerDroit(curr, 'f1uid');
                prev.push(tranformed);
            }
            if (curr.visiteurFemme) {
                const tranformed = this.creerDroit(curr, 'g1uid');
                prev.push(tranformed);
            }
            if (curr.abonneV1) {
                const tranformed = this.creerDroit(curr, 'h1uid');
                prev.push(tranformed);
            }
            if (curr.moderateurV1) {
                const tranformed = this.creerDroit(curr, 'i1uid');
                prev.push(tranformed);
            }
            if (curr.administrateurV1) {
                const tranformed = this.creerDroit(curr, 'j1uid');
                prev.push(tranformed);
            }

            return prev;
        }, []);
        return result;
    }

    creerDroit(currentItem: any, idRole: string) {
        const tranformed = {
        etape: currentItem.etape,
        idRole : idRole,
        idDroit: currentItem.idDroit,
        tagDroit: currentItem.tagDroit,
        valueRoleDroit : 1
        };
        return tranformed;
    }
    pivotDroits(droits: any, etape: string) {
        // uid role
        // let visiteurUid = "visuid";
        const abonneUid = 'abouid';
        // let moderateurUid = "moduid";
        // let administrateurUid = "admuid";

        const visiteurHommeUid = 'f1uid';
        const visiteurFemmeUid = 'g1uid';
        const abonneV1Uid = 'h1uid';
        const moderateurV1Uid = 'i1uid';
        const administrateurV1Uid = 'j1uid';

        const etapeTousDroits = LibelleDroits.filter(droit => droit.etape === etape);

        let result = droits.reduce((prev, curr) => {
                    if (!prev.some(it => it.idDroit === curr.idDroit)) {
            const memeDroit = droits.filter(droit => droit.idDroit === curr.idDroit);
            const labelDroit = LibelleDroits.find(droit => droit.id === curr.idDroit);
                        const tranformed = {
                            etape: curr.etape,
                idDroit: curr.idDroit,
                libelleDroit : labelDroit !== undefined ? labelDroit.libelle : curr.idDroit,
                // visiteur: memeDroit.some(dt => dt.idRole === visiteurUid),
                abonne: memeDroit.some(dt => dt.idRole === abonneUid),
                // moderateur: memeDroit.some(dt => dt.idRole === moderateurUid),
                // administrateur: memeDroit.some(dt => dt.idRole === administrateurUid),
                visiteurHomme: memeDroit.some(dt => dt.idRole === visiteurHommeUid),
                visiteurFemme: memeDroit.some(dt => dt.idRole === visiteurFemmeUid),
                abonneV1: memeDroit.some(dt => dt.idRole === abonneV1Uid),
                moderateurV1: memeDroit.some(dt => dt.idRole === moderateurV1Uid),
                administrateurV1: memeDroit.some(dt => dt.idRole === administrateurV1Uid),
                tagDroit: labelDroit !== undefined ? labelDroit.tagDroit : curr.tagDroit, // curr.tagDroit,
                valueRoleDroit : curr.valueRoleDroit
                        };
                        prev.push(tranformed);
                    }
                    return prev;
        }, []);

        // ajout false si droit n'existe
        if (result.length < etapeTousDroits.length)
        {
            etapeTousDroits.reduce((prev, curr) => {
            if (!prev.some(it => it.idDroit === curr.id)) {
                const tranformed = {
                etape: curr.etape,
                idDroit: curr.id,
                libelleDroit :  curr.libelle,
                // visiteur: false,
                abonne: false,
                // moderateur: false,
                // administrateur: false,
                visiteurHomme: false,
                visiteurFemme: false,
                abonneV1: false,
                moderateurV1: false,
                administrateurV1Uid: false,
                tagDroit : curr.tagDroit,
                valueRoleDroit : null
                };
                prev.push(tranformed);
            }
            return prev;
            }, result);
        }

        // tri droits
        result = result.sort((droit1, droit2) => {
            return droit1.idDroit < droit2.idDroit ? -1 :
                (droit1.idDroit > droit2.idDroit ? 1 : 0);
        });
        return result;
    }

    siteDoFromDto(siteDto: SiteDto): SiteDo {
        let droits = [];
        const droitListeProfils = this.pivotRoles(siteDto.droitListeProfils);
        droits = droits.concat(droitListeProfils);
        const droitRechercheProfils = this.pivotRoles(siteDto.droitRechercheProfils);
        droits = droits.concat(droitRechercheProfils);
        const droitChat = this.pivotRoles(siteDto.droitChat);
        droits = droits.concat(droitChat);
        const droitProfil = this.pivotRoles(siteDto.droitProfil);
        droits = droits.concat(droitProfil);

        const droitAccountSettings = this.pivotRoles(siteDto.droitAccountSettings);
        droits = droits.concat(droitAccountSettings);
        const droitFavorisAncAmis = this.pivotRoles(siteDto.droitFavorisAncAmis);
        droits = droits.concat(droitFavorisAncAmis);
        const droitVisiteurs = this.pivotRoles(siteDto.droitVisiteurs);
        droits = droits.concat(droitVisiteurs);
        const droitBlacklist = this.pivotRoles(siteDto.droitBlacklist);
        droits = droits.concat(droitBlacklist);
        const droitNotificationsEmail = this.pivotRoles(siteDto.droitNotificationsEmail);
        droits = droits.concat(droitNotificationsEmail);
        const droitAffichagePublicite = this.pivotRoles(siteDto.droitAffichagePublicite);
        droits = droits.concat(droitAffichagePublicite);
        const droitSondages = this.pivotRoles(siteDto.droitSondages);
        droits = droits.concat(droitSondages);
        const droitPetitesAnnonces = this.pivotRoles(siteDto.droitPetitesAnnonces);
        droits = droits.concat(droitPetitesAnnonces);
        const droitConfessionnal = this.pivotRoles(siteDto.droitConfessionnal);
        droits = droits.concat(droitConfessionnal);

        // --------------------------------
        const droitJournalPageEvent = this.pivotRoles(siteDto.droitJournalPageEvent);
        droits = droits.concat(droitJournalPageEvent);
        const droitVisioChat = this.pivotRoles(siteDto.droitVisioChat);
        droits = droits.concat(droitVisioChat);
        const droitResultatRecherche = this.pivotRoles(siteDto.droitResultatRecherche);
        droits = droits.concat(droitResultatRecherche);
        return new SiteDo(
            siteDto.idSite,
            siteDto.siteName,
            siteDto.idThematique,
            siteDto.colors,
            droits,
            siteDto.point,
            siteDto.timer,
            siteDto.slogan
        );
    }
}
