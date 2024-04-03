import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  OnDestroy,
  Output,
  signal,
} from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { ThemeEditorForm } from '../../shared/models/theme-editor-form.interface';
import { Theme } from '../../shared/models/theme.interface';

@Component({
  selector: 'app-editor',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './editor.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EditorComponent implements OnDestroy {
  @Output() themeChanged = new EventEmitter<any>();

  themeEditor = signal<Theme>({} as Theme);
  themeForm: FormGroup<ThemeEditorForm> | undefined;

  private destroy$ = new Subject<void>();

  ngOnInit(): void {
    this.themeForm = new FormGroup<ThemeEditorForm>({
      avatarShape: new FormControl<string>('circle'),
      textColor: new FormControl<string>('#1A1A1A'),
      borderRadius: new FormControl<number>(50),
      backgroundColor: new FormControl<string>('#BDBDBD'),
      linkTextColor: new FormControl<string>('#CE1C40'),
    });
    this.themeEditor.set(this.themeForm.value as Theme);

    this.themeChanged.emit(this.themeEditor);

    this.themeForm.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe((value) => {
        this.themeEditor.set(value as Theme);
        this.themeChanged.emit(this.themeEditor);
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
