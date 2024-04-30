import { createFeatureSelector, createSelector } from '@ngrx/store';
import { ImageState } from '../states/image.state';

// Selector for the entire image state
const selectImageFeature = createFeatureSelector<ImageState>('images');

// Selector to get the list of images from the state
export const getImageList = createSelector(
  selectImageFeature,
  (state: ImageState) => state.images
);

// Selector to get the selected image from the state
export const getSelectedImage = createSelector(
  selectImageFeature,
  (state: ImageState) => state.selectedImage
);
