import { FormControl } from '@angular/forms';

export interface ThemeEditorForm {
  avatarShape: FormControl<string | null>;
  textColor: FormControl<string | null>;
  borderRadius: FormControl<number | null>;
  backgroundColor: FormControl<string | null>;
  linkTextColor: FormControl<string | null>;
}
