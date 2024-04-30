// src/app/state/images/image.reducer.ts
import { createReducer, on } from '@ngrx/store';
import * as ImageActions from '../actions/image.actions';
import { initialImageState } from '../states/image.state';

export const imageReducer = createReducer(
  initialImageState,
  on(ImageActions.loadImagesSuccess, (state, { images }) => ({
    ...state,
    images,
  })),
  on(ImageActions.selectImage, (state, { image }) => ({
    ...state,
    selectedImage: image,
  })),
  on(ImageActions.clearSelection, (state) => ({
    ...state,
    selectedImage: null,
  })),
  on(ImageActions.addImage, (state, { image }) => ({
    ...state,
    images: [...state.images, image],
  }))
);
