import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick,
} from '@angular/core/testing';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { addImage } from '../shared/store';
import { FooterComponent } from './footer.component';
describe('FooterComponent', () => {
  let component: FooterComponent;
  let fixture: ComponentFixture<FooterComponent>;
  let store: MockStore;
  let dispatchSpy: jasmine.Spy;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FooterComponent],
      providers: [provideMockStore({})],
    }).compileComponents();

    store = TestBed.inject(MockStore);
    dispatchSpy = spyOn(store, 'dispatch');
    fixture = TestBed.createComponent(FooterComponent);
    component = fixture.componentInstance;

    spyOn(window, 'FileReader').and.returnValue({
      readAsDataURL: function () {
        this.result = 'data:image/jpeg;base64,carlos.messi'; // Simulate the result of reading a file
        if (typeof this.onload === 'function') {
          this.onload(); // Manually trigger the onload to simulate FileReader behavior
        }
      },
      onload: () => {}, // Ensure onload is a function
    } as any);

    fixture.detectChanges();
  });

  it('should handle file input and dispatch addImage action', fakeAsync(() => {
    const fakeFile = new File([''], 'test.jpg', { type: 'image/jpeg' });
    const fileList = {
      item: (index: number) => (index === 0 ? fakeFile : null),
      length: 1,
    } as FileList;

    component.handleFileInput(fileList);
    tick(); // Ensure all async operations complete

    expect(dispatchSpy).toHaveBeenCalledWith(
      addImage({
        image: jasmine.any(Object) as any,
      })
    );
  }));
});
