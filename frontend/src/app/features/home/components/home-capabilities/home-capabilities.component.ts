import { ChangeDetectionStrategy, Component } from '@angular/core';

import { HomeCardComponent } from '../home-card/home-card.component';
import { HomeIconComponent, HomeIconName } from '../home-icon/home-icon.component';

interface CapabilityCard {
  readonly icon: HomeIconName;
  readonly title: string;
  readonly label: string;
}

@Component({
  selector: 'app-home-capabilities',
  standalone: true,
  imports: [HomeCardComponent, HomeIconComponent],
  templateUrl: './home-capabilities.component.html',
  styleUrl: './home-capabilities.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeCapabilitiesComponent {
  protected readonly capabilities: readonly CapabilityCard[] = [
    { icon: 'api', title: 'REST API', label: 'Development' },
    { icon: 'key', title: 'JWT & RBAC', label: 'Secure Auth' },
    { icon: 'storage', title: 'MongoDB & SQL', label: 'Database Architecture' },
    { icon: 'psychology', title: 'DSA', label: 'Problem Solving' },
  ];
}
