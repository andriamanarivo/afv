import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
// import 'rxjs/Rx';

import { CountryRest} from '../../rest/country/country.rest';

import { CountryMetierServiceACI } from '.';



@Injectable()
export class CountryMetierService implements CountryMetierServiceACI {
    public getFranceCity(country: string, term: string) {
        return this.countryRest.getFranceCity(country, term)                  
            .map(this.extractData)
            .catch(this.handleError);
    }

    constructor(
        //private http : Http,
    private countryRest: CountryRest) { }
    public getCountry(country: string): Observable<any>  {
        return this.countryRest.getCountry(country)      
            //.map(res => res)
            //.map(res => this.extractData)
            .map(this.extractData)
            .catch(this.handleError);
    }

    public getCountryIso(countryIso: string): Observable<any>  {
        return this.countryRest.getCountryIso(countryIso)
            .map(this.extractData)
            .catch(this.handleError);
    }

    public getCity(country: string): Observable<any>  {
        return this.countryRest.getCity(country)      
            //.map(res => res)
            //.map(res => this.extractData)
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
