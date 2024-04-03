import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ProfileAvatarDirective } from '../../directives/profile/profile-avatar.directive';
import { ProfileBoxDirective } from '../../directives/profile/profile-box.directive';
import { ProfileDetailsDirective } from '../../directives/profile/profile-details.directive';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    ProfileBoxDirective,
    ProfileAvatarDirective,
    ProfileDetailsDirective,
  ],
  templateUrl: './profile.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProfileComponent {}
