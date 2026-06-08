import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-project-next-project',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './project-next-project.component.html',
  styleUrl: './project-next-project.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProjectNextProjectComponent {}
