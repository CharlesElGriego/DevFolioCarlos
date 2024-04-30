import { ActionReducerMap, MetaReducer } from '@ngrx/store';
import { imageReducer } from './reducers/images.reducers';
import { ImageState } from './states/image.state';
export interface AppState {
  images: ImageState;
}

export const reducers: ActionReducerMap<AppState> = {
  images: imageReducer,
};

export const metaReducers: MetaReducer<AppState>[] = [];

export * from './actions/image.actions';
export * from './reducers/images.reducers';
export * from './selectors/images.selectors';
export * from './states/image.state';
