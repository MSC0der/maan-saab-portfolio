import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-projects-cta',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './projects-cta.component.html',
  styleUrl: './projects-cta.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProjectsCtaComponent {}