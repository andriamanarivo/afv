import {Pipe} from '@angular/core'

@Pipe({
  name: 'truncate'
})
export class TruncatePipe {
  transform(value: string, limit: number = 20, trail: String = '…') : string {
    //console.log("TruncatePipe --->",args[0]);
    /* let limit = args.length > 0 ? parseInt(args[0], 10) : 20;
    let trail = args.length > 1 ? args[1] : '...'; */

    return value.length > limit ? value.substring(0, limit) + trail : value;
  }
}