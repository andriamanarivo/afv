import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: '[customDay]'
})
export class CustomDayDirective {

  //inputPattern = '^[0-9]*$';

  private inputPattern: RegExp = new RegExp(/^(0?\d|[12]\d|3[01])$/g);

  // /^(0?\d|[12]\d|3[01])-(0?\d|1[012])-((?:19|20)\d{2})$/;

  // Allow key codes for special events. Reflect :
  // Backspace, tab, end, home
  private specialKeys: Array<string> = [ 
    'Backspace', 
    'Tab', 
    'End', 
    'Home',
    'Delete',
    'ArrowLeft',
    'ArrowRight'
   ];

  

constructor(private el: ElementRef) { 

}
  @HostListener('keydown', ['$event']) onKeyDown(event) {
    let e = <KeyboardEvent> event;
    // Allow Backspace, tab, end, and home keys
    if (this.specialKeys.indexOf(event.key) !== -1) {
      return;
    }

    // Do not use event.keycode this is deprecated.
    // See: https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/keyCode
    let current: string = this.el.nativeElement.value;
    // We need this because the current value on the DOM element
    // is not yet updated with the value from this event
    let next: string = current.concat(event.key);
    if (next && !String(next).match(this.inputPattern)) {
        event.preventDefault();
    }
  }

}
