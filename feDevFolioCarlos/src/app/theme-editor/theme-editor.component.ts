import {
  ChangeDetectionStrategy,
  Component,
  WritableSignal,
  signal,
} from '@angular/core';
import { Theme } from '../shared/models/theme.interface';
import { EditorComponent } from './editor/editor.component';
import { ProfilePreviewComponent } from './profile-preview/profile-preview.component';

@Component({
  selector: 'app-theme-editor',
  standalone: true,
  imports: [EditorComponent, ProfilePreviewComponent],
  templateUrl: './theme-editor.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ThemeEditorComponent {
  currentTheme = signal<Theme>({} as Theme);
  user = {
    name: 'Charlie Brown',
    bio: 'Software Developer',
    blog: 'https://example.com',
    avatar:
      'https://staging.cohostcdn.org/attachment/fb1b5a1c-ac93-486e-801a-119ca88793b8/ps1-hagrid.jpg?width=675&auto=webp&dpr=2',
    id: 1,
  };
  themeChange(theme: WritableSignal<Theme>) {
    this.currentTheme = theme;
  }
}
