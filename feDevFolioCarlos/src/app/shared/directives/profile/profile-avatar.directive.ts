import { Directive, HostBinding, Input } from '@angular/core';

@Directive({
  selector: 'app-profile-avatar',
  standalone: true,
})
export class ProfileAvatarDirective {
  @Input() avatarUrl: string | undefined;
  @Input() avatarShape: 'circle' | 'square' | undefined;

  @HostBinding('style.backgroundImage') get backgroundImage(): string {
    return `url(${this.avatarUrl})`;
  }
  @HostBinding('class') get hostClasses(): string {
    const shapeClass =
      this.avatarShape === 'circle' ? 'rounded-full' : 'rounded-none';
    return `${shapeClass} w-24 h-24 bg-cover bg-center mb-5`;
  }
}
