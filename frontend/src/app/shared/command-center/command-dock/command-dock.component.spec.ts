import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CommandDockComponent } from './command-dock.component';

describe('CommandDockComponent', () => {
  let component: CommandDockComponent;
  let fixture: ComponentFixture<CommandDockComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CommandDockComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CommandDockComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
