/**
 * ng2-idle - A module for responding to idle users in Angular2 applications.
 # @author Mike Grabski <me@mikegrabski.com> (http://mikegrabski.com/)
 * @version v1.0.0-alpha.18
 * @link https://github.com/HackedByChinese/ng2-idle.git#readme
 * @license MIT
 */
import {EventEmitter} from '@angular/core';

import {InterruptArgs} from './interruptargs';

/*
 * A base for classes that act as a source for interrupts.
 */
export abstract class InterruptSource {
  isAttached = false;

  public onInterrupt: EventEmitter<InterruptArgs> = new EventEmitter<InterruptArgs>();

  constructor(
      protected attachFn?: (source: InterruptSource) => void,
      protected detachFn?: (source: InterruptSource) => void) {}

  /*
   * Attaches to the specified events on the specified source.
   */
  attach(): void {
    if (!this.isAttached && this.attachFn) {
      this.attachFn(this);
    }

    this.isAttached = true;
  }

  /*
   * Detaches from the specified events on the specified source.
   */
  detach(): void {
    if (this.isAttached && this.detachFn) {
      this.detachFn(this);
    }

    this.isAttached = false;
  }
}
