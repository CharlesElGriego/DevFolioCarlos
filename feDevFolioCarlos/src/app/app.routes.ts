import { Routes } from '@angular/router';
import { ThemeEditorComponent } from './theme-editor/theme-editor.component';

export const routes: Routes = [
  { path: '', redirectTo: '/theme-editor', pathMatch: 'full' },
  { path: 'theme-editor', component: ThemeEditorComponent },
];
