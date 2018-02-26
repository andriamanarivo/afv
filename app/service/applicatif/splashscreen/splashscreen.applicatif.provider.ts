import { SplashscreenApplicatifServiceACI } from "app/service/applicatif/splashscreen/splashscreen.applicatif.service.aci";
import { SplashscreenApplicatifService } from "app/service/applicatif/splashscreen/splashscreen.applicatif.service";



export let SplashscreenApplicatifServiceProvider = {
    provide: SplashscreenApplicatifServiceACI,
    useClass: SplashscreenApplicatifService
};


// export let SiteApplicatifServiceMockProvider = {
//     provide: SiteApplicatifServiceACI,
//     useClass: SiteApplicatifServiceMock
// };