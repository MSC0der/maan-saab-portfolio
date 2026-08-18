import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FooterComponent } from '../footer/footer.component';
import { HeaderComponent } from '../header/header.component';
import { CommandCenterComponent } from "../../../shared/command-center/command-center/command-center.component";
import { TransitionOverlayComponent } from "../../../shared/command-center/transition-overlay/transition-overlay.component";
import { ToastComponent } from '../../ui/toast/toast.component';

@Component({
  selector: 'app-shell',
  standalone: true,
  imports: [
    FooterComponent,
    HeaderComponent,
    RouterOutlet,
    CommandCenterComponent,
    TransitionOverlayComponent,
    ToastComponent
],
  templateUrl: './shell.component.html',
  styleUrl: './shell.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ShellComponent {}
