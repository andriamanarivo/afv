/**
 * ng2-idle - A module for responding to idle users in Angular2 applications.
 # @author Mike Grabski <me@mikegrabski.com> (http://mikegrabski.com/)
 * @version v1.0.0-alpha.18
 * @link https://github.com/HackedByChinese/ng2-idle.git#readme
 * @license MIT
 */
import {Subscription} from 'rxjs/Rx';

import {InterruptArgs} from './interruptargs';
import {InterruptSource} from './interruptsource';

/*
 * A class for managing an interrupt from an interrupt source.
 */
export class Interrupt {
  private sub: Subscription;

  constructor(public source: InterruptSource) {}

  /*
   * Subscribes to the interrupt using the specified function.
   * @param fn - The subscription function.
   */
  subscribe(fn: (args: InterruptArgs) => void): void {
    this.sub = this.source.onInterrupt.subscribe(fn);
  }

  /*
   * Unsubscribes the interrupt.
   */
  unsubscribe(): void {
    this.sub.unsubscribe();
    this.sub = null;
  }

  /*
   * Keeps the subscription but resumes interrupt events.
   */
  resume(): void { this.source.attach(); }

  /*
   * Keeps the subscription but pauses interrupt events.
   */
  pause(): void { this.source.detach(); }
}
