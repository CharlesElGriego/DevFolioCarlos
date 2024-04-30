import { createAction, props } from '@ngrx/store';

export const loadImages = createAction('[Image List] Load Images');
export const loadImagesSuccess = createAction(
  '[Image List] Load Images Success',
  props<{ images: any[] }>()
);
export const selectImage = createAction(
  '[Image List] Select Image',
  props<{ image: any }>()
);
export const clearSelection = createAction('[Image List] Clear Selection');
export const addImage = createAction(
  '[Image List] Add Image',
  props<{ image: any }>()
);
export const loadImagesFailure = createAction(
  '[Image] Load Images Failure',
  props<{ error: any }>()
);
