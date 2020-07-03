import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'moderator'
})
export class ModeratorPipe implements PipeTransform {

  transform(list: any[], value: any) {
    if (value == "all") {
      return list
    }
    else {
      console.log(typeof (value))
      const x = list ? list.filter(item => item.slmcVerified == value) : list;
      return x  
    }
    // console.log("x at pipe: "+JSON.stringify(x))
  }

}
