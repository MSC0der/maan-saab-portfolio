import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
} from '@angular/core';

import { TRANSITIONS, TransitionOption } from '../data/transitions.data';
import { TransitionService } from '../services/transition.service';

@Component({
  selector: 'app-animation-center',
  standalone: true,
  templateUrl: './animation-center.component.html',
  styleUrl: './animation-center.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AnimationCenterComponent {
  private readonly transitionService = inject(TransitionService);

  protected readonly transitions = TRANSITIONS;

  protected readonly selected = signal<TransitionOption>(
    TRANSITIONS.find((t) => t.id === this.transitionService.preferred()) ??
      TRANSITIONS[0],
  );

  protected rememberChoice = signal(true);

  protected select(option: TransitionOption) {
    this.selected.set(option);

    this.transitionService.setPreferred(option.id, this.rememberChoice());
  }

  protected preview() {
    this.transitionService.play(this.selected().id);
  }
}
