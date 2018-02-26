/**
 * ng2-idle - A module for responding to idle users in Angular2 applications.
 # @author Mike Grabski <me@mikegrabski.com> (http://mikegrabski.com/)
 * @version v1.0.0-alpha.18
 * @link https://github.com/HackedByChinese/ng2-idle.git#readme
 * @license MIT
 */
import {EventTargetInterruptSource} from './eventtargetinterruptsource';

/*
 * An interrupt source on the Window object.
 */
export class WindowInterruptSource extends EventTargetInterruptSource {
  constructor(events: string, throttleDelay = 500) { super(window, events, throttleDelay); }
}
