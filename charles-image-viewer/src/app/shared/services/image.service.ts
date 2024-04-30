import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Image } from '../models';
import * as ImageActions from '../store/actions/image.actions';
@Injectable({
  providedIn: 'root',
})
export class ImageService {
  constructor(private readonly http: HttpClient) {}

  getImages() {
    return this.http
      .get<Image[]>('https://picsum.photos/v2/list?limit=30')
      .pipe(
        map((images) => ImageActions.loadImagesSuccess({ images })),
        catchError(() => of({ type: '[Image List] Load Images Failed' }))
      );
  }
}
