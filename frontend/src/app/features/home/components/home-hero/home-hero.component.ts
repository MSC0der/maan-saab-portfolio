import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ThemeService } from '../../../../core/services/theme.service';
import { THEME_HOME_CONFIG } from '../../../../core/config/theme-home.config';
import { HomeHeroActionsComponent } from '../home-hero-actions/home-hero-actions.component';
import { HomeHeroVisualComponent } from '../home-hero-visual/home-hero-visual.component';
import { HomeTechChipComponent } from '../home-tech-chip/home-tech-chip.component';

@Component({
  selector: 'app-home-hero',
  standalone: true,
  imports: [
    HomeHeroActionsComponent,
    HomeHeroVisualComponent,
    HomeTechChipComponent,
  ],
  templateUrl: './home-hero.component.html',
  styleUrl: './home-hero.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeHeroComponent {
  constructor(private readonly themeService: ThemeService) {}
  protected readonly technologies = [
    'Node.js',
    'Angular',
    'MongoDB',
    'MySQL',
    'TypeScript',
  ];
  protected get heroConfig() {
   return THEME_HOME_CONFIG[this.themeService.theme()].hero;
  }

  protected readonly heroImageUrl =
    'https://lh3.googleusercontent.com/aida-public/AB6AXuAoGShijmM7ph32jKl6gonMGEnHtqB5AFR2Cnz-8cPEk3Arj60ub4ALX-Ok13HPNeStYLE_SBY-MPwS1MyD4ILqM4WZ0ZaKm_tpvHX3q2HDJdGs5mBKbQ_014O5aS8uK95xl50xpKpcQ5m7z8UBPMf9uflYcrbd0IT_q-Wznu-tqnSWg2dP1LXrgJ4lkU617FdYPmPDHosh7DKZr5YZq-zyVpF0db4SymUi4lw444scn3Z5WhE7iJecI4ENOQvFOPzxxKCo6VaiMD6p';
}
