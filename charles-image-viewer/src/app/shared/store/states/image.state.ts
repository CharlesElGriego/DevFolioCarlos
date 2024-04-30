import { Image } from '../../models/image.model';

export interface ImageState {
  images: Image[];
  selectedImage: Image | null;
}

export const initialImageState: ImageState = {
  images: [],
  selectedImage: null,
};
