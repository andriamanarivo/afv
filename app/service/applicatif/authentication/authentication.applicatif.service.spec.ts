/*
import { async, TestBed,inject } from '@angular/core/testing';
import { DebugElement } from '@angular/core';
import { 
    AuthenticationMetierServiceMockProvider,
    AuthenticationMetierServiceMock,
    AuthenticationMetierServiceACI
 } from '../../../service/metier/authentication';

import {
    AuthenticationApplicatifServiceACI
    } from '.';
describe('Service: Authentication applicatif', () => {
    let authenticationMetierService: AuthenticationMetierServiceACI;

    beforeEach(async(() => {
    TestBed.configureTestingModule({
        //imports: [HttpModule],
        providers: [
            AuthenticationMetierServiceMockProvider,
            AuthenticationMetierServiceMock,
            AuthenticationMetierServiceACI
         ]

    });
  }));

  beforeEach(inject([AuthenticationMetierServiceACI], (heroMetierServiceMock: AuthenticationMetierServiceACI) => {
    authenticationMetierService = heroMetierServiceMock;
  }));

  it('should create', () => {
    expect(authenticationMetierService).toBeDefined();

  });

  it('should return true from isAuthenticated when there is a token', () => { 
  sessionStorage.setItem('token', '1234'); 
  //expect(authenticationMetierService.login()).toBeTruthy(); 
});


});
*/