
import {
    PseudoMetierServiceACI,
    PseudoMetierService,
    PseudoMetierServiceMock
} from '.';

export let PseudoMetierServiceProvider = {
    provide: PseudoMetierServiceACI,
    useClass: PseudoMetierService
};

export let PseudoMetierServiceMockProvider = {
    provide: PseudoMetierServiceACI,
    useClass: PseudoMetierServiceMock
};
