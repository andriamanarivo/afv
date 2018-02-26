import { Injectable } from '@angular/core';
import { CountryApplicatifServiceACI } from '.';

import {Observable} from "rxjs/Observable";

import { mockcountry } from '../../../donnee/country/mock-country';
import { mockcity } from '../../../donnee/city/mock-city';

declare var Auth0Lock: any;

@Injectable()
export class CountryApplicatifServiceMock implements CountryApplicatifServiceACI {
    public getFranceCity(country: string, term: string) {
        throw new Error("Method not implemented.");
    }

    constructor( ) {}
    
    public getCountry(country: string) {
        return Observable.of(mockcountry.hits.hits);
    }

    public getCountryIso(countryIso: string) {
        return null;
    }

    public getCity(country: string) {
        return Observable.of(mockcity.hits);
    }
    
}
