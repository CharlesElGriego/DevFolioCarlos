import {
  Directive,
  ElementRef,
  Input,
  OnChanges,
  Renderer2,
  SimpleChanges,
} from '@angular/core';

@Directive({
  selector: 'app-profile-details',
  standalone: true,
})
export class ProfileDetailsDirective implements OnChanges {
  @Input() linkTextColor: string | undefined;

  constructor(
    private readonly el: ElementRef,
    private readonly renderer: Renderer2
  ) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes?.['linkTextColor']) {
      this.updateLinkColor();
    }
  }

  private updateLinkColor(): void {
    const link = this.el.nativeElement.querySelector('a');
    if (link && this.linkTextColor) {
      this.renderer.setStyle(link, 'color', this.linkTextColor);
    }
  }
}
