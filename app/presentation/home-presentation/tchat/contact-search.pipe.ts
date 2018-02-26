import { Pipe, PipeTransform } from '@angular/core';

import { Contact } from '../../../donnee/chat';

@Pipe({ name: 'contactSearchPipe' })
export class ContactSearchPipe implements PipeTransform {
  transform(contacts: Contact[], searchTerm: string) {   
    searchTerm = searchTerm || "";
    searchTerm = searchTerm.toLowerCase();
    if (searchTerm) {
        contacts = contacts.filter(contact => {
            return contact.name.toLowerCase().indexOf(searchTerm) >= 0;
        });
    }    
    return contacts;
  }
}
