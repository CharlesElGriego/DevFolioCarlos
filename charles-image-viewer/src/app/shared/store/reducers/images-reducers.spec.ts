import { Image } from '../../models';
import * as ImageActions from '../actions/image.actions';
import { initialImageState } from '../states/image.state';
import { imageReducer } from './images.reducers';
const imageRandom: Image = {
  author: 'User',
  download_url: 'test.jpg',
  height: 200,
  id: '1',
  url: 'test.jpg',
  width: 200,
};
describe('imageReducer', () => {
  it('should return the initial state', () => {
    const action = {} as any;
    const state = imageReducer(
      {
        images: [],
        selectedImage: null,
      },
      action
    );
    expect(state).toBe(state);
  });

  it('should load images and update the state', () => {
    const images = [imageRandom, { ...imageRandom, id: '2' }];
    const action = ImageActions.loadImagesSuccess({ images });
    const state = imageReducer(initialImageState, action);
    expect(state.images).toEqual(images);
    expect(state.selectedImage).toBeNull();
  });

  it('should handle selectImage and update the selected image', () => {
    const images = [imageRandom, { ...imageRandom, id: '2' }];
    const action = ImageActions.selectImage({ image: images[0] });
    const state = imageReducer(initialImageState, action);
    expect(state.selectedImage?.id).toEqual(imageRandom.id);
  });

  it('should clear the selected image', () => {
    const action = ImageActions.clearSelection();
    const state = imageReducer(initialImageState, action);
    ImageActions.selectImage({ image: imageRandom });
    ImageActions.clearSelection();
    expect(state.selectedImage).toBeNull();
  });

  it('should add a new image to the images list', () => {
    const action = ImageActions.addImage({ image: imageRandom });
    const state = imageReducer(initialImageState, action);
    expect(state.images.length).toEqual(1);
    expect(state.images[0].id).toEqual('1');
  });
});
