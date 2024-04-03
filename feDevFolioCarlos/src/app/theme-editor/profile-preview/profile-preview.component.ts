import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  Input,
  signal,
} from '@angular/core';
import { ProfileComponent } from '../../shared/components/profile/profile.component';
import { ProfileAvatarDirective } from '../../shared/directives/profile/profile-avatar.directive';
import { ProfileBoxDirective } from '../../shared/directives/profile/profile-box.directive';
import { ProfileDetailsDirective } from '../../shared/directives/profile/profile-details.directive';
import { Theme } from '../../shared/models/theme.interface';
import { User } from '../../shared/models/user.interface';

@Component({
  selector: 'app-profile-preview',
  standalone: true,
  imports: [
    CommonModule,
    ProfileComponent,
    ProfileBoxDirective,
    ProfileAvatarDirective,
    ProfileDetailsDirective,
  ],
  templateUrl: './profile-preview.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProfilePreviewComponent {
  @Input() theme = signal<Theme>({} as Theme);
  @Input() user!: User;
}
