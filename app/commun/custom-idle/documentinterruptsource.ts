/**
 * ng2-idle - A module for responding to idle users in Angular2 applications.
 # @author Mike Grabski <me@mikegrabski.com> (http://mikegrabski.com/)
 * @version v1.0.0-alpha.18
 * @link https://github.com/HackedByChinese/ng2-idle.git#readme
 * @license MIT
 */
import {EventTargetInterruptSource} from './eventtargetinterruptsource';

/*
 * An interrupt source that uses events on the document element (html tag).
 */
export class DocumentInterruptSource extends EventTargetInterruptSource {
  constructor(events: string, throttleDelay = 500) {
    super(document.documentElement, events, throttleDelay);
  }

  /*
   * Checks to see if the event should be filtered.
   * @param event - The original event object.
   * @return True if the event should be filtered (don't cause an interrupt); otherwise, false.
   */
  filterEvent(event: any): boolean {
    // some browser bad input hacks
    if (event.type === 'mousemove'
        // fix for Chrome destop notifications
        && ((event.originalEvent && event.originalEvent.movementX === 0 &&
             event.originalEvent.movementY === 0)
            // fix for webkit fake mousemove
            || (event.movementX !== void 0 && !event.movementX || !event.movementY))) {
      return true;
    }

    return false;
  }
}
