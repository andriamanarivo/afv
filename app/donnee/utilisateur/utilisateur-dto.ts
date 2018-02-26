export class UtilisateurDto {
    constructor(
        public id: string, 
        public email: string, 
        public pseudo: string,
        public ville: string,
        public departement: string,
        public description: string,
        public dateNaissance: string,
        public dateNaissanceC: string,
        public age: string,
        public ageC: string,
        public origine: string,
        public experience: string,
        public mobilite: string,
        public disponibilite: string,
        public isActive: number,
        public site: string,
        public vetes: string,
        public statut: string,
        public orientation: string,
        public situation: string,
        public tendance: string,
        public recherche: string
    ) {}
}
