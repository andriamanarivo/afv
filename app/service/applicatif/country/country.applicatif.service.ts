import { Injectable } from '@angular/core';
import { CountryApplicatifServiceACI } from '.';
//import { AuthHttp, tokenNotExpired, JwtHelper } from 'angular2-jwt';
import {Http, Headers, RequestOptions, Response} from '@angular/http';

import { CountryMetierServiceACI} from '../../metier/country/country.metier.service.aci';
import { mockcountry } from '../../../donnee/country/mock-country';
import { mockcity } from '../../../donnee/city/mock-city';

import { Country } from '../../../donnee/country/country';
import { City } from '../../../donnee/city/city';
import { UtilsService } from "../../../commun/utils.service";

import { Observable } from 'rxjs/Observable';
// import 'rxjs/Rx';

@Injectable()
export class CountryApplicatifService implements CountryApplicatifServiceACI {    
    authtoken: string;
    constructor(
        private http: Http,
        private countryMetierService : CountryMetierServiceACI,
        private utilsService: UtilsService
        //private authHttp: AuthHttp
        ) {}

    public getCountry(country: string) {
        if (country && country.length !== 0) {
            return this.countryMetierService.getCountry(country.toLowerCase())
                .map(res => this.countryDtoFromDo(res, this));
        } else {
            return Observable.of([]);
        }
    }
    public getFranceCity(country: string, term: string) {
        if (term && term.length !== 0) {
            return this.countryMetierService.getFranceCity(country, term)
                .map(res=>{return this.cityDtoFromDo(res, this)});
        }else {
            return Observable.of([]);
        }
    }
    public getCountryIso(countryIso: string) {
        return this.countryMetierService.getCountryIso(countryIso)
        .map(res => this.countryDtoFromDo(res, this));
    }

    public getCity(country: string) {
        return this.countryMetierService.getCity(country)
        .map(res => this.cityDtoFromDo(res, this));
        /*return Observable.of(mockcity)
        .map(this.cityDtoFromDo);*/
    }

    private countryDtoFromDo(res, me): Country[] {
        // console.log(res);
        if(res && res.hits && res.hits.hits){
            const result =  res.hits.hits.map((it) => new Country(it._id, it._source.pays, it._source.iso3));
            const results = me.sortCountries(result);
            return results;
        }
        return [];
    }

    public sortCountries(countries): Country[]  {    
        const sortedCountries =  countries.sort((country1, country2) => {
            /* return country1.name < country2.name ? -1 :
                (country1.name > country2.name ? 1 : 0); */
                return country1.name.localeCompare(country2.name);
        });        
        return sortedCountries;
    }

    public sortCities(cities): City[] {
        const sortedCities =   cities.sort((city1, city2) => {
            /* return city1.commune < city2.commune ? -1 :
                (city1.commune > city2.commune ? 1 : 0); */
                return city1.commune.localeCompare(city2.commune);
        });        
        return sortedCities;
    }
    private cityDtoFromDo(res, me): City[] {
        if (res && res.hits && res.hits.hits) {
            const result =  res.hits.hits.map((it) => {
                const commune = me.utilsService.capitalizeFirstLetter(it._source.commune);
                return new City(
                    it._id,
                    it._index,
                    it._type,
                    it._source.cp,
                    commune,
                    it._source.departement,
                    it._source.region,
                    it._source.statut,
                    it._source.geo_point_2d.lat,
                    it._source.geo_point_2d.lon
                    )
            });
            const results = me.sortCities(result);
            return results;
        }
        return [];
    }
}
