export abstract class CountryMetierServiceACI {
    public abstract getCountry(country: string);
    public abstract getCountryIso(countryIso: string);
    public abstract getCity(country: string);
     public abstract getFranceCity(country: string, term: string);

}
