import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable'; 

import { CountryMetierServiceACI } from '.';

import { mockcountry } from '../../../donnee/country/mock-country';
import { mockcity } from '../../../donnee/city/mock-city';

import { Country } from '../../../donnee/country/country';

@Injectable()
export class CountryMetierServiceMock implements CountryMetierServiceACI {
    public getFranceCity(country: string, term: string) {
        throw new Error("Method not implemented.");
    }


    public getCountry(country: string) {
        return Observable.of(mockcountry.hits.hits)
            .map(this.countryDtoFromDo);
    }

    public getCountryIso(countryIso: string) {
        return null;
    }

    public getCity(country: string) {
        return Observable.of(mockcity.hits);
    }

    private countryDtoFromDo(res): Country[] {
        return res.hits.hits.map((it) => new Country(it._id, it._source.pays, it._source.iso3));
    }

}


