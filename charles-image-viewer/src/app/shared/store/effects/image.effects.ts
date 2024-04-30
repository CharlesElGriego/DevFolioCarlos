// Define effects in state/images/image.effects.ts
import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { mergeMap } from 'rxjs/operators';
import { ImageService } from '../../services/image.service';
import * as ImageActions from '../actions/image.actions';

@Injectable()
export class ImageEffects {
  loadImages$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ImageActions.loadImages),
      mergeMap(() => this.imageService.getImages())
    )
  );

  constructor(
    private readonly actions$: Actions,
    private readonly imageService: ImageService
  ) {}
}
