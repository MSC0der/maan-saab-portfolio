import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-projects-hero',
  standalone: true,
  templateUrl: './projects-hero.component.html',
  styleUrl: './projects-hero.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProjectsHeroComponent {}