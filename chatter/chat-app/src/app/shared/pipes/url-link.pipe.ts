import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'urlLink'
})
export class UrlLinkPipe implements PipeTransform {

  transform(text: string): string {
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    return text.replace(urlRegex, `<a href="$1" target="_blank">$1</a>`);
  }

}
