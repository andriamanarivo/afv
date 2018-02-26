import { Injectable, Inject } from '@angular/core';
import { Headers, Http, Response, RequestOptions} from '@angular/http';

import { Observable } from 'rxjs/Observable';

import { AppConfig }       from '../../../contrainte/config/_app/app.config';

import { environment } from '../../../../environments/environment';

@Injectable()
export class CountryRest {

    private headers = new Headers({ 'Content-Type': 'application/json' });
    
    baseUrlEs: string;
    countryUrl: string;
    cityUrl: string;
    idSite: string;

    constructor(private http: Http, private appConfig : AppConfig) {
        this.countryUrl = this.appConfig.getConfig("countryUrl");
        this.cityUrl = this.appConfig.getConfig("cityUrl");
        this.idSite = this.appConfig.getSiteIdByLocation();
        this.baseUrlEs = environment.baseUrlEs;
        //this.baseUrlApp =  this.appConfig.getConfig("baseUrlAppUrl").substring(0,;
        //let baseUrlAppli = this.appConfig.getConfig("baseUrlAppUrl");
        //this.baseUrlApp = baseUrlAppli.substring(0,baseUrlAppli.length - 1);
    }
 

    getCountry(country: string): Observable<Response> {
        const countryUrl = this.baseUrlEs  +
        this.countryUrl + '_search?q=pays.raw:' + country + '*';
        
        return this.http.get(countryUrl);
    }

    getCountryIso(countryIso: string): Observable<Response> {
        const countryUrl = this.baseUrlEs +
        this.countryUrl + '_search?q=iso3:' + countryIso;
        return this.http.get(countryUrl);
    }

    getCity(country: string): Observable<Response> {
        const cityUrl = this.baseUrlEs  +
        country + this.cityUrl + '_search?q=commune:par*';
        return this.http.get(cityUrl);
    }

    getFranceCity(country: string, term: string): Observable<Response> {
        const cityUrl = this.baseUrlEs  +
        country + this.cityUrl + '_search?q=commune.raw:' + term + '*' + '&sort=commune.sort:asc';
        return this.http.get(cityUrl);
    }



}