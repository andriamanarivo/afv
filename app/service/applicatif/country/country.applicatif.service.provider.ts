import {
    CountryApplicatifServiceACI,
    CountryApplicatifService,
    CountryApplicatifServiceMock
} from '.';


export let CountryApplicatifServiceProvider = {
    provide: CountryApplicatifServiceACI,
    useClass: CountryApplicatifService
};

export let CountryApplicatifServiceMockProvider = {
    provide: CountryApplicatifServiceACI,
    useClass: CountryApplicatifServiceMock
};