import {
    PseudoApplicatifServiceACI,
    PseudoApplicatifService,
    PseudoApplicatifServiceMock
} from '.';


export let PseudoApplicatifServiceProvider = {
    provide: PseudoApplicatifServiceACI,
    useClass: PseudoApplicatifService
};

export let PseudoApplicatifServiceMockProvider = {
    provide: PseudoApplicatifServiceACI,
    useClass: PseudoApplicatifServiceMock
};