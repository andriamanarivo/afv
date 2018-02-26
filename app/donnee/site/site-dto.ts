export class SiteDto {
    constructor(
        public idSite: string,
        public siteName: string,
        public idThematique: string,
        public colors : any[],
        public droitListeProfils : any[],
        public droitRechercheProfils : any[],
        public droitChat : any[],
        public droitProfil : any[],
        public droitAccountSettings: any[],
        public droitFavorisAncAmis : any[],
        public droitVisiteurs : any[],
        public droitBlacklist : any[],
        public droitNotificationsEmail : any[],
        public droitAffichagePublicite : any[],
        public droitSondages : any[],
        public droitPetitesAnnonces : any[],
        public droitConfessionnal: any[],
        public droitJournalPageEvent: any[],
        public droitVisioChat: any[],
        public droitResultatRecherche: any[],
        public point: any[],
        public timer: any[],
        public slogan: any[],

    ) {}
}
