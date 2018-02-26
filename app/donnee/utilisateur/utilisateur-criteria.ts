export class UtilisateurCriteria {
    constructor(
        public isActive: string, 
        public statut: string,
        public search: string, 
        public pageIndex: number,
        public pageCount: number,
        public orderColumn: string, 
        public orderDirection: string,
        public moderation :string
    ) {}
}
