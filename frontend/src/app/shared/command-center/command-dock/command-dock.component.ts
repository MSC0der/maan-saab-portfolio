import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

import { CommandCenterService } from '../services/command-center.service';

@Component({
  selector: 'app-command-dock',
  standalone: true,
  templateUrl: './command-dock.component.html',
  styleUrl: './command-dock.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CommandDockComponent {
  protected readonly commandCenter = inject(CommandCenterService);

  protected readonly activePanel = this.commandCenter.activePanel;

  protected toggle(panel: 'themes' | 'animations' | 'terminal') {
    this.commandCenter.toggle(panel);
  }
}
