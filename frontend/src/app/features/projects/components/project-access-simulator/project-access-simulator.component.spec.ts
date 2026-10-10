import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectAccessSimulatorComponent } from './project-access-simulator.component';

describe('ProjectAccessSimulatorComponent', () => {
  let fixture: ComponentFixture<ProjectAccessSimulatorComponent>;
  let el: HTMLElement;

  const chip = (label: string): HTMLButtonElement => {
    const found = Array.from(
      el.querySelectorAll<HTMLButtonElement>('.sim__chip'),
    ).find((button) => button.textContent?.includes(label));
    if (!found) {
      throw new Error(`No chip labelled "${label}"`);
    }
    return found;
  };

  const verdict = (): string =>
    el.querySelector('.sim__verdict')?.textContent?.trim() ?? '';

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProjectAccessSimulatorComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ProjectAccessSimulatorComponent);
    el = fixture.nativeElement;
    fixture.detectChanges();
  });

  it('denies a request the role has no permission group for', () => {
    chip('Viewer').click();
    chip('Publish a policy').click();
    fixture.detectChanges();

    expect(verdict()).toContain('DENY');
  });

  it('lets a senior role inherit permission groups from junior roles', () => {
    chip('Compliance Officer').click();
    chip('View a compliance record').click(); // records.read comes from Viewer
    fixture.detectChanges();

    expect(verdict()).toContain('ALLOW');
  });

  it('keeps the least-privileged role out of higher-level actions', () => {
    chip('Viewer').click();
    chip('Change a user’s role').click();
    fixture.detectChanges();

    expect(verdict()).toContain('DENY');
  });

  it('records each sent request in the audit trail, newest first', () => {
    chip('Viewer').click();
    chip('Read the audit log').click();
    fixture.detectChanges();
    el.querySelector<HTMLButtonElement>('.sim__send')?.click();

    chip('Admin').click();
    fixture.detectChanges();
    el.querySelector<HTMLButtonElement>('.sim__send')?.click();
    fixture.detectChanges();

    const rows = el.querySelectorAll('.sim__audit li');
    expect(rows.length).toBe(2);
    expect(rows[0].textContent).toContain('Admin');
    expect(rows[0].textContent).toContain('ALLOW');
    expect(rows[1].textContent).toContain('Viewer');
    expect(rows[1].textContent).toContain('DENY');
  });
});
