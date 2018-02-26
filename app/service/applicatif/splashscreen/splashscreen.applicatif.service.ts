import { Injectable } from '@angular/core';
import { SplashscreenApplicatifServiceACI } from 'app/service/applicatif/splashscreen/splashscreen.applicatif.service.aci';
import { Message } from 'app/donnee/splashScreen/message';
import { SplashscreenMetierServiceACI } from 'app/service/metier/splashscreen/splashscreen.metier.service.aci';

@Injectable()
export class SplashscreenApplicatifService implements SplashscreenApplicatifServiceACI {


    constructor(
        private splashscrennMetier: SplashscreenMetierServiceACI
    ) { }

    public sendMessage(data: Message) {
        return this.splashscrennMetier.sendMessage(data);
    }

}
