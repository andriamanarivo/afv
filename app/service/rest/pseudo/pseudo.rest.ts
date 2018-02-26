import { Injectable, Inject } from '@angular/core';
import { Headers, Http, Response, RequestOptions} from '@angular/http';

import { Observable } from 'rxjs/Observable';

import { AppConfig }       from '../../../contrainte/config/_app/app.config';

import { environment } from '../../../../environments/environment';

@Injectable()
export class PseudoRest {

    private headers = new Headers({ 'Content-Type': 'application/json' });
    
    baseUrlApp: string;
    pseudoUrl: string;

    idSite: string;
    constructor(private http: Http, private appConfig : AppConfig) {
        this.pseudoUrl = this.appConfig.getConfig("pseudoUrl");
        this.idSite = this.appConfig.getSiteIdByLocation();
        //this.baseUrlApp = this.appConfig.getConfig("baseUrlAppUrl");
        this.baseUrlApp = environment.baseUrlAppUrl;
    }
 

    getPseudo(): Observable<Response> {
        let pseudoUrl = this.baseUrlApp  + this.idSite + this.pseudoUrl;
        return this.http.get(pseudoUrl);
    }

    
}