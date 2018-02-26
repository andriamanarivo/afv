
export abstract class SiteMetierServiceACI {
    public abstract scorableField() ;
    public abstract getSites() ;

    public abstract getSite(idSite : string);
    public abstract getSiteInit();
    public abstract addUpdateSite(site);
    public abstract deleteSite(idSite : string);

}