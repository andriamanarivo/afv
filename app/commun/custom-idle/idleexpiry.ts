/**
 * ng2-idle - A module for responding to idle users in Angular2 applications.
 # @author Mike Grabski <me@mikegrabski.com> (http://mikegrabski.com/)
 * @version v1.0.0-alpha.18
 * @link https://github.com/HackedByChinese/ng2-idle.git#readme
 * @license MIT
 */
/*
 * Represents a base class for types that provide expiry detection for the Idle service.
 */
export abstract class IdleExpiry {
  protected idValue: any;

  constructor() { this.idValue = new Date(); }

  /*
   * Gets or sets a unique ID for the window
   * @param id - The id.
   * @return The current id.
   */
  id(value?: any): any {
    if (value !== void 0) {
      if (!value) {
        throw new Error('A value must be specified for the ID.');
      }

      this.idValue = value;
    }

    return this.idValue;
  }

  /*
   * Gets or sets the last expiry date.
   * @param value - The value to set.
   * @return The last expiry value.
   */
  abstract last(value?: Date): Date;

  /*
   * Returns the current Date.
   * @return The current Date.
   */
  now(): Date { return new Date(); }

  /*
   * Returns whether or not it is expired.
   * @return True if expired; otherwise, false.
   */
  isExpired(): boolean {
    const expiry = this.last();
    return expiry != null && expiry <= this.now();
  }
}
