
import { Injectable, OnInit } from '@angular/core';
import { Http, Response , RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable'; 
import { ReCaptchaResponse } from '../../../donnee/authentication/recaptcharesponse';

@Injectable()
export class ReCaptchaService  {
    public recaptchaResponse: Observable<ReCaptchaResponse>;
    public constructor(private http: Http) {

    }

    public verifyUserResponse(usetoken: string): Observable<ReCaptchaResponse> {
    

    return this.http.post('https://www.google.com/recaptcha/api/siteverify', {'g-recaptcha-response': usetoken})
        .map( (res: Response) => this.extractData(res))
        .catch( (error: Response | any) => this.handleError(error));
  }

  private extractData(res: Response): ReCaptchaResponse {
    const recaptchaResponse: ReCaptchaResponse = res.json();
    return recaptchaResponse;
  }

  private handleError (error: Response | any): Observable<ReCaptchaResponse> {
    let errMsg: string;
    if (error instanceof Response) {
      let body = error.json() || '';
      let err = body.error || JSON.stringify(body);
      errMsg = error.status + ' - ' + (error.statusText || '') + ': ' + err;
    } else {
      errMsg = error.message ? error.message : error.toString();
    }

    return Observable.throw({ success: false, status_code: 0, error_codes: [errMsg]});
  }
}
