import { Injectable } from '@angular/core';
import { Message } from 'app/donnee/splashScreen/message';
import { Headers, Http, Response, RequestOptions} from '@angular/http';
import { environment } from '../../../../environments/environment';



@Injectable()
export class SplashscreenRestService {
    baseUrlApp: string;

    constructor(private http: Http) { 
        this.baseUrlApp = environment.baseUrlAppUrl;
    }

    sendMessage(data: Message) {        
        return this.http.post(this.baseUrlApp + data.idSite + '/contact_admin', data);
    }
}