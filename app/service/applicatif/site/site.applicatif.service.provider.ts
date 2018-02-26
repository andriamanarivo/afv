import {
    SiteApplicatifServiceACI,
    SiteApplicatifService,
    SiteApplicatifServiceMock
} from '.';


export let SiteApplicatifServiceProvider = {
    provide: SiteApplicatifServiceACI,
    useClass: SiteApplicatifService
};


export let SiteApplicatifServiceMockProvider = {
    provide: SiteApplicatifServiceACI,
    useClass: SiteApplicatifServiceMock
};