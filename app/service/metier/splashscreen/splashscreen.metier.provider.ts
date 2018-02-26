import { SplashscreenMetierServiceACI } from 'app/service/metier/splashscreen/splashscreen.metier.service.aci';
import { SplashscreenMetierService } from 'app/service/metier/splashscreen/splashscreen.metier.service';


export let SplashscreenMetierServiceProvider = {
    provide: SplashscreenMetierServiceACI,
    useClass: SplashscreenMetierService
};


// export let SiteApplicatifServiceMockProvider = {
//     provide: SiteApplicatifServiceACI,
//     useClass: SiteApplicatifServiceMock
// };