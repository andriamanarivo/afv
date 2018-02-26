import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable'; 

import { InscriptionMetierServiceACI } from '.';
import { Inscription } from '../../../donnee/inscription/inscription';
import { inscriptionstep } from '../../../donnee/inscription/mock-process-inscription';
import { mockinscription } from '../../../donnee/inscription/mock-inscription';
import { mockRenderMail } from '../../../donnee/inscription/mock-render-mail';

import { MockBackend , MockConnection } from '@angular/http/testing';

import { 
    Headers, BaseRequestOptions,
  Response, ResponseOptions,
  HttpModule, Http, XHRBackend, RequestMethod,
  ResponseType
 } from '@angular/http';


@Injectable()
export class InscriptionMetierServiceMock implements InscriptionMetierServiceACI {
    public getIp() {
        throw new Error("Method not implemented.");
    }
    public verifyUserDatas(userData: any) {
        throw new Error("Method not implemented.");
    }
    constructor(
        private connection : MockConnection,
        private mockBackend : MockBackend
    ) { }
       
    public getInscription(id: number) {
        return Observable.of(inscriptionstep);        
        //return Promise.resolve(inscriptionstep);
        //return this.mockGetInscriptionKO(405);
        //return this.mockGetInscriptionOK();
    }

    public postConfirmInscription(pseudo : String, email:String, code : String, sentDate : String): Observable<any>  {
        return Observable.of(mockRenderMail);
    }
    

    public postInscription(inscription: Inscription): Observable<any>  {
        return Observable.of(mockinscription);
        //return this.mockpostInscription(500);
    }

    /*
    mockGetInscriptionKO(status : Number): Observable<Response> {
        let body = {
            "exception":this.getExceptionError(status),
            "code":0
        };
        let opts = {
            type:ResponseType.Error, 
            status:405, 
            body: body
        };
        let responseOpts = new ResponseOptions(opts);

        let res = this.connection.mockRespond (new Response (responseOpts));

        return this.mockBackend.connections.subscribe(conn => {
            res
        });
    }
    getExceptionError(status : Number): String {
        switch (status) {
            case 405:
                return "No route found for \"POST \/1\/inscription\": Method Not Allowed (Allow: GET, OPTIONS, HEAD)";
                case 404:
                return "No route found for \"POST \/web\/app_dev.php\/1\/inscription\"";
            default:
                return "No route found for \"POST \/web\/app_dev.php\/1\/inscription\"";
        }
    }
    mockGetInscriptionOK(): Observable<Response> {
        
        let opts = {
            type:ResponseType.Basic, 
            status:200, 
            body: inscriptionstep
        };
        let responseOpts = new ResponseOptions(opts);

        let res = this.connection.mockRespond (new Response (responseOpts));

        return this.mockBackend.connections.subscribe(conn => {
            res
        });
    }
    */
    
    /*
    mockpostInscription(status : Number): Observable<Response> {
        let resBody  = {
            "status":status,
            "error":this.getPostInscriptionError(status),
            "result":[]
        };

        let opts = {
            type:ResponseType.Basic, 
            status:200, 
            body: resBody
        };
        let responseOpts = new ResponseOptions(opts);

        let res = this.connection.mockRespond (new Response (responseOpts));

        return this.mockBackend.connections.subscribe(conn => {
            res
        });
    }

    getPostInscriptionError(status : Number): boolean {
        switch (status) {
            case 500:
                return null;
            case 200:
                return false;
            default:
                return false;
        }
    }
    */
}
