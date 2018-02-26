import { Inscription } from '../../../donnee/inscription/inscription';
export abstract class InscriptionMetierServiceACI {
    public abstract getInscription(id: number);
    public abstract postInscription(inscription: Inscription);

    public abstract postConfirmInscription(pseudo : String, email:String, code : String, sentDate : String);
    public abstract verifyUserDatas(userData: any);
    public abstract getIp();
   


}
