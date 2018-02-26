import { Injectable } from '@angular/core';
import { SplashscreenMetierServiceACI } from 'app/service/metier/splashscreen/splashscreen.metier.service.aci';
import { Message } from 'app/donnee/splashScreen/message';
import { SplashscreenRestService } from 'app/service/rest/splashscreen/splashscreen.rest.service';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class SplashscreenMetierService implements SplashscreenMetierServiceACI {
    constructor(
        private splashscreenRestService: SplashscreenRestService
    ) { }
    public sendMessage(data: Message) {
        return this.splashscreenRestService.sendMessage(data)
        .map(this.extractData)
        .catch(this.handleError);
    }
    private extractData(res: any) {
        let data = res.json();
        return data;
    }
    private handleError(error: any) {
        return Observable.throw(error);
    }
}
