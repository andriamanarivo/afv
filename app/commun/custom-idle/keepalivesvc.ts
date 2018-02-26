/**
 * ng2-idle - A module for responding to idle users in Angular2 applications.
 # @author Mike Grabski <me@mikegrabski.com> (http://mikegrabski.com/)
 * @version v1.0.0-alpha.18
 * @link https://github.com/HackedByChinese/ng2-idle.git#readme
 * @license MIT
 */
export abstract class KeepaliveSvc {
  abstract start(): void;
  abstract stop(): void;
  abstract ping(): void;
}
