import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-home-status',
  standalone: true,
  templateUrl: './home-status.component.html',
  styleUrl: './home-status.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeStatusComponent {}
