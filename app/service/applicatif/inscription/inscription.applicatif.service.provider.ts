import {
    InscriptionApplicatifServiceACI,
    InscriptionApplicatifService,
    InscriptionApplicatifServiceMock
} from '.';


export let InscriptionApplicatifServiceProvider = {
    provide: InscriptionApplicatifServiceACI,
    useClass: InscriptionApplicatifService
};

export let InscriptionApplicatifServiceMockProvider = {
    provide: InscriptionApplicatifServiceACI,
    useClass: InscriptionApplicatifServiceMock
};