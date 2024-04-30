import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { StoreModule } from '@ngrx/store';
import { ImageGalleryComponent } from './image-gallery.component';

describe('ImageGalleryComponent', () => {
  let component: ImageGalleryComponent;
  let fixture: ComponentFixture<ImageGalleryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ImageGalleryComponent, StoreModule.forRoot({})],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(ImageGalleryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
