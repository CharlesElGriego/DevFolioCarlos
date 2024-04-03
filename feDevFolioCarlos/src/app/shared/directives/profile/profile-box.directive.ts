import { Directive, HostBinding, Input } from '@angular/core';

@Directive({
  selector: 'app-profile-box',
  standalone: true,
})
export class ProfileBoxDirective {
  @Input() textColor: string | undefined;
  @Input() borderRadius: string | undefined;
  @Input() backgroundColor: string | undefined;

  @HostBinding('style.color') get getColor() {
    return this.textColor;
  }

  @HostBinding('style.borderRadius') get getBorderRadius() {
    return this.borderRadius;
  }

  @HostBinding('style.backgroundColor') get getBackgroundColor() {
    return this.backgroundColor;
  }
  @HostBinding('class') className =
    'p-5 w-80 mx-auto flex flex-col items-center';
}
