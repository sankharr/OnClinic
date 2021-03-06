import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'moderatorPatient'
})
export class ModeratorPatientPipe implements PipeTransform {

  transform(items: any[], searchText: string): any[] {
    if (!items) return [];
    if (!searchText) return items
    searchText = searchText.toLowerCase();
    return items.filter(it => {
      return it.email.toLowerCase().includes(searchText)||it.name.toLowerCase().includes(searchText) ;
    });
  }

}
