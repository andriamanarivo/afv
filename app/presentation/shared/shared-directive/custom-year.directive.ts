import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: '[customYear]'
})
export class CustomYearDirective {

  inputPattern: RegExp = new RegExp(/^[0-9]+$/g);
  // /^(?:4[0-9]{12}$/
  ///^(?:1|2)$/
  //let numericPattern = /^[0-9]+$/;
  //let pseudoPattern = /^[a-zA-Z]+[a-zA-Z0-9]+.{0,10}$/;
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
