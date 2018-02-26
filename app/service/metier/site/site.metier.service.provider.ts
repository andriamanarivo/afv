
import {
    SiteMetierServiceACI,
    SiteMetierService,
    SiteMetierServiceMock,
    SiteMetierServiceMockErr
} from '.';

export let SiteMetierServiceProvider = {
    provide: SiteMetierServiceACI,
    useClass: SiteMetierService
};

export let SiteMetierServiceMockProvider = {
    provide: SiteMetierServiceACI,
    useClass: SiteMetierServiceMock
};
