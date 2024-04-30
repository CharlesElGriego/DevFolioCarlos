import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { addImage } from '../shared/store';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [],
  templateUrl: './footer.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FooterComponent {
  constructor(private readonly store: Store) {}

  handleFileInput(files: FileList): void {
    const file = files.item(0);
    if (file && file.type.match(/image\/(png|jpg|jpeg)$/)) {
      const reader = new FileReader();
      reader.onload = (event: any) => {
        const newImage = {
          id: Date.now().toString(),
          url: event.target.result,
          download_url: event.target.result,
          author: 'User',
          height: 200, // Estos valores pueden ser ajustados
          width: 200,
        };
        this.store.dispatch(addImage({ image: newImage }));
      };
      reader.readAsDataURL(file);
    }
  }
}
