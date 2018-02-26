/**
 * ng2-idle - A module for responding to idle users in Angular2 applications.
 # @author Mike Grabski <me@mikegrabski.com> (http://mikegrabski.com/)
 * @version v1.0.0-alpha.18
 * @link https://github.com/HackedByChinese/ng2-idle.git#readme
 * @license MIT
 */
import {ModuleWithProviders, NgModule} from '@angular/core';

import {Idle} from './idle';
import {IdleExpiry} from './idleexpiry';
import {SimpleExpiry} from './simpleexpiry';

@NgModule()
export class Ng2IdleModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: Ng2IdleModule,
      providers: [SimpleExpiry, {provide: IdleExpiry, useExisting: SimpleExpiry}, Idle]
    };
  }
}
