import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommandCenterService } from '../services/command-center.service';
import { ThemeSwitcherComponent } from '../theme-switcher/theme-switcher.component';
import { CommandDockComponent } from '../command-dock/command-dock.component';
import { AnimationCenterComponent } from '../animation-center/animation-center.component';
import { TerminalComponent } from '../terminal/terminal.component';

@Component({
  selector: 'app-command-center',
  standalone: true,
  imports: [
    CommandDockComponent,
    ThemeSwitcherComponent,
    AnimationCenterComponent,
    TerminalComponent,
  ],
  templateUrl: './command-center.component.html',
  styleUrl: './command-center.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CommandCenterComponent {
  protected readonly commandCenter = inject(CommandCenterService);

  protected readonly activePanel = this.commandCenter.activePanel;

  protected close(): void {
    this.commandCenter.close();
  }
}
