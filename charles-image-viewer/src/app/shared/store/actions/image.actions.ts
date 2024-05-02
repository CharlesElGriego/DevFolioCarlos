import { createAction, props } from '@ngrx/store';
import { Image } from '../../models';

export const loadImages = createAction('[Image List] Load Images');
export const loadImagesSuccess = createAction(
  '[Image List] Load Images Success',
  props<{ images: Image[] }>()
);
export const selectImage = createAction(
  '[Image List] Select Image',
  props<{ image: Image }>()
);
export const clearSelection = createAction('[Image List] Clear Selection');
export const addImage = createAction(
  '[Image List] Add Image',
  props<{ image: Image }>()
);
export const loadImagesFailure = createAction(
  '[Image] Load Images Failure',
  props<{ error: Image }>()
);
