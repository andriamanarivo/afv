
import {
    InscriptionMetierServiceACI,
    InscriptionMetierService,
    InscriptionMetierServiceMock
} from '.';

export let InscriptionMetierServiceProvider = {
    provide: InscriptionMetierServiceACI,
    useClass: InscriptionMetierService
};

export let InscriptionMetierServiceMockProvider = {
    provide: InscriptionMetierServiceACI,
    useClass: InscriptionMetierServiceMock
};
