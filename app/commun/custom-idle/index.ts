/**
 * ng2-idle - A module for responding to idle users in Angular2 applications.
 # @author Mike Grabski <me@mikegrabski.com> (http://mikegrabski.com/)
 * @version v1.0.0-alpha.18
 * @link https://github.com/HackedByChinese/ng2-idle.git#readme
 * @license MIT
 */
import {DocumentInterruptSource} from './documentinterruptsource';

export * from './idle';
export * from './interruptargs';
export * from './interruptsource';
export * from './eventtargetinterruptsource';
export * from './documentinterruptsource';
export * from './windowinterruptsource';
export * from './keepalivesvc';
export * from './idleexpiry';
export * from './simpleexpiry';

export const DEFAULT_INTERRUPTSOURCES: any[] = [new DocumentInterruptSource(
    'mousemove keydown DOMMouseScroll mousewheel mousedown touchstart touchmove scroll')];

export {Ng2IdleModule} from './module';
