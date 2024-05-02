import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { Image } from '../shared/models';
import {
  clearSelection,
  getImageList,
  loadImages,
  selectImage,
} from '../shared/store';
import { ImageGalleryComponent } from './image-gallery.component';
const testImage = {
  id: '1',
  url: 'test.jpg',
  download_url: 'test.jpg',
  author: 'tester',
  height: 100,
  width: 100,
};

describe('ImageGalleryComponent', () => {
  let component: ImageGalleryComponent;
  let fixture: ComponentFixture<ImageGalleryComponent>;
  let store: MockStore;
  let dispatchSpy: any;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ImageGalleryComponent],
      providers: [provideMockStore({ initialState: {} })],
    }).compileComponents();

    store = TestBed.inject(MockStore);
    dispatchSpy = spyOn(store, 'dispatch').and.callThrough();
    fixture = TestBed.createComponent(ImageGalleryComponent);
    component = fixture.componentInstance;

    // Mock the selector used in the component
    store.overrideSelector(getImageList, []);

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should dispatch loadImages on init', () => {
    expect(dispatchSpy).toHaveBeenCalledWith(loadImages());
  });

  it('should dispatch selectImage when onSelect is called', () => {
    const testImage = {
      id: '1',
      url: 'test.jpg',
      download_url: 'test.jpg',
      author: 'tester',
      height: 100,
      width: 100,
    };
    component.onSelect(testImage);
    expect(dispatchSpy).toHaveBeenCalledWith(selectImage({ image: testImage }));
  });

  it('should dispatch clearSelection when onClearSelection is called', () => {
    component.onClearSelection();
    expect(dispatchSpy).toHaveBeenCalledWith(clearSelection());
  });

  it('should handle image subscription', () => {
    const testImages = [{ ...testImage, id: '2' }];
    store.overrideSelector(getImageList, testImages);
    fixture.detectChanges();

    let images: Image[] = [];
    component.images$.subscribe((i) => {
      images = i;
    });

    expect(images).toEqual(testImages);
  });
});
