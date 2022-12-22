import { DomSanitizer } from '@angular/platform-browser'
import { PipeTransform, Pipe } from "@angular/core";

@Pipe({
  name: 'trustHTML'
})
export class TrustHTMLPipe implements PipeTransform {
  constructor(private sanitized: DomSanitizer) {}
  transform(value: any, ...args: unknown[]): unknown {
    return this.sanitized.bypassSecurityTrustHtml(value);
  }
}
