import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { Image } from '../shared/models';
import {
  clearSelection,
  getImageList,
  getSelectedImage,
  loadImages,
  selectImage,
} from '../shared/store';

@Component({
  selector: 'app-image-gallery',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './image-gallery.component.html',
  styleUrl: './image-gallery.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ImageGalleryComponent implements OnDestroy {
  images$ = this.store.select(getImageList);
  selectedImage$ = this.store.select(getSelectedImage);
  private subscription: Subscription;
  constructor(private store: Store) {
    this.store.dispatch(loadImages());
    this.subscription = this.images$.subscribe(() => {});
  }
  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
  onSelect(image: Image): void {
    this.store.dispatch(selectImage({ image }));
  }

  onClearSelection(): void {
    this.store.dispatch(clearSelection());
  }
}
