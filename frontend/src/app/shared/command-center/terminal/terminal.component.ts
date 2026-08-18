import {
  AfterViewInit,
  Component,
  ElementRef,
  ViewChild,
  inject,
  signal,
} from '@angular/core';
import { Router } from '@angular/router';
import { ThemeService } from '../../../core/services/theme.service';
import { ResumeService } from '../../../core/services/resume.service';
import { CommandCenterService } from '../services/command-center.service';

@Component({
  selector: 'app-terminal',
  standalone: true,
  imports: [],
  templateUrl: './terminal.component.html',
  styleUrl: './terminal.component.scss',
})
export class TerminalComponent implements AfterViewInit {
  ngAfterViewInit(): void {
    this.scrollToBottom();
  }
  @ViewChild('terminalScreen')
  private terminalScreen?: ElementRef<HTMLElement>;
  // Signals
  protected readonly command = signal('');
  private readonly router = inject(Router);

  private readonly themeService = inject(ThemeService);

  private readonly commandCenter = inject(CommandCenterService);

  private readonly resumeService = inject(ResumeService);

  protected readonly history = signal<string[]>([
    '$ portfolio-runtime --boot',
    '',
    'Initializing runtime...',
    '',
    '✓ Theme engine loaded',
    '✓ Angular application ready',
    '✓ Router initialized',
    '✓ Backend services connected',
    '✓ AWS integration active',
    '',
    'System ready.',
    '',
    'Type "help" to begin.',
    '',
  ]);

  protected executeCommand(): void {
    const input = this.command().trim().toLowerCase();

    if (!input) {
      return;
    }

    this.append(`> ${input}`);

    const args = input.split(/\s+/);

    const command = args[0];

    switch (command) {
      case 'help':
        this.showHelp();
        break;

      case 'about':
        this.showAbout();
        break;

      case 'experience':
        this.showExperience();
        break;

      case 'skills':
        this.showSkills();
        break;

      case 'projects':
        this.showProjects();
        break;

      case 'education':
        this.showEducation();
        break;

      case 'theme':
        this.showTheme();
        break;

      case 'clear':
        this.clearConsole();
        break;

      case 'resume':
        this.downloadResume();
        break;

      case 'whoami':
        this.showWhoAmI();
        break;

      case 'stack':
        this.showStack();
        break;

      case 'status':
        this.showStatus();
        break;

      case 'hire':
        this.showHire();
        break;

      case 'coffee':
        this.showCoffee();
        break;

      case 'version':
        this.showVersion();
        break;

      case 'ls':
        this.showLs();
        break;

      case 'pwd':
        this.showPwd();
        break;

      case 'secret':
        this.showSecret();
        break;

      case 'matrix':
        this.showMatrix();
        break;

      case 'batman':
        this.showBatman();
        break;

      case 'open':
        this.handleOpen(args[1]);
        break;

      case 'sudo':
        this.handleSudo(args);
        break;

      default:
        this.unknownCommand(input);
    }

    this.command.set('');
  }

  private handleOpen(target?: string): void {
    switch (target) {
      case 'projects':
        this.openProjects();
        break;

      case 'contact':
        this.goToContact();
        break;

      case 'github':
        this.openGithub();
        break;

      case 'linkedin':
        this.openLinkedIn();
        break;

      default:
        this.append('', 'Usage: open <projects|contact|github|linkedin>', '');
    }
  }

  private append(...lines: string[]): void {
    this.history.update((history) => [...history, ...lines]);

    this.scrollToBottom();
  }

  private showHelp(): void {
    this.append(
      '',
      'Available Commands',
      '',
      'help             Show this help',
      'about            Professional summary',
      'experience       Work experience',
      'skills           Technical skills',
      'projects         List featured projects',
      'education        Education',
      'theme            Current theme',
      'status           Runtime status',
      'version          Portfolio version',
      'whoami           About the developer',
      'stack            Tech stack',
      'ls               List portfolio sections',
      'pwd              Current location',
      'clear            Clear terminal',
      '',
      'Navigation',
      'open projects',
      'open contact',
      'open github',
      'open linkedin',
      'resume',
      '',
    );
  }

  private showAbout(): void {
    this.append(
      '',
      'Ranbir Singh Maan',
      'Backend-Focused Full Stack Engineer',
      '',
      'Building secure REST APIs, scalable backend systems,',
      'authentication workflows and modern web applications.',
      '',
      'Current Focus',
      '• Backend Architecture',
      '• Node.js',
      '• Angular',
      '• Performance Optimization',
      '',
    );
  }

  private showExperience(): void {
    this.append(
      '',
      'Professional Experience',
      '',
      'Imminent Ideas Pvt Ltd',
      'Full Stack Developer',
      'Jan 2025 - Present',
      '',
      '• REST API Development',
      '• JWT Authentication',
      '• RBAC',
      '• Payment Gateway Integration',
      '• Node Cron Automation',
      '• Angular Integration',
      '',
    );
  }

  private showSkills(): void {
    this.append(
      '',
      'Languages',
      '• JavaScript',
      '• TypeScript',
      '• C++',
      '',
      'Backend',
      '• Node.js',
      '• Express.js',
      '• REST APIs',
      '',
      'Frontend',
      '• Angular',
      '• React',
      '',
      'Database',
      '• MongoDB',
      '• MySQL',
      '',
      'Security',
      '• JWT',
      '• RBAC',
      '',
    );
  }

  private showProjects(): void {
    this.append(
      '',
      'Featured Projects',
      '',
      '1. Security Compliance System',
      '   Node.js | Express | Angular | MongoDB',
      '',
      '2. Garage Management System',
      '   Node.js | Angular | MongoDB | SQL',
      '',
      '3. Portfolio v2',
      '   Angular | SCSS | Theme Engine',
      '',
    );
  }

  private showWhoAmI(): void {
    this.append(
      '',
      'Ranbir Singh Maan',
      'Backend-Focused Full Stack Engineer',
      '',
      'Specializing in scalable backend systems,',
      'REST APIs, authentication and cloud integrations.',
      '',
    );
  }

  private showStack(): void {
    this.append(
      '',
      'Tech Stack',
      '',
      'Backend',
      '• Node.js',
      '• Express.js',
      '',
      'Frontend',
      '• Angular',
      '• React',
      '',
      'Database',
      '• MongoDB',
      '• MySQL',
      '',
      'Cloud',
      '• AWS',
      '',
      'Languages',
      '• TypeScript',
      '• JavaScript',
      '• C++',
      '',
    );
  }

  private showStatus(): void {
    this.append(
      '',
      'Portfolio Runtime Status',
      '',
      '✔ Angular ............. Online',
      '✔ Backend APIs ........ Online',
      '✔ AWS Services ........ Connected',
      '✔ Theme Engine ........ Active',
      '✔ Portfolio ........... Production',
      '',
    );
  }

  private showHire(): void {
    this.append(
      '',
      'Interview request received.',
      '',
      'Email:',
      'ranbirsinghmaan7392@gmail.com',
      '',
      'Looking forward to connecting.',
      '',
    );
  }

  private showCoffee(): void {
    this.append('', 'Brewing coffee...', '', '☕ Productivity +15', '');
  }

  private showVersion(): void {
    this.append(
      '',
      'Portfolio Runtime',
      'Version : 2.5.0',
      '',
      'Angular 18',
      'Node.js',
      'Production Build',
      '',
    );
  }

  private showLs(): void {
    this.append(
      '',
      'about/',
      'projects/',
      'blog/',
      'contact/',
      'resume.pdf',
      '',
    );
  }

  private showPwd(): void {
    this.append('', '/portfolio/runtime', '');
  }

  private showSecret(): void {
    this.append(
      '',
      'Thanks for taking the time',
      'to explore my portfolio.',
      '',
      '— Ranbir Singh Maan',
      '',
    );
  }

  private showMatrix(): void {
    this.append('', 'Wake up, Neo...', '', 'The portfolio has you.', '');
  }

  private showBatman(): void {
    if (this.themeService.theme() === 'wayne') {
      this.append(
        '',
        'Wayne Division',
        'Access Granted.',
        '',
        'Welcome back, Mr. Wayne.',
        '',
      );
      return;
    }

    this.append(
      '',
      'Wayne Division inactive.',
      '',
      'Switch to the Wayne theme to unlock this protocol.',
      '',
    );
  }

  private handleSudo(args: string[]): void {
    if (args.join(' ') === 'sudo hire maan') {
      this.append('', 'Permission granted.', '', 'Welcome aboard.', '');
      return;
    }

    this.append('', 'sudo: permission denied.', '');
  }

  private openProjects(): void {
    this.append('', 'Opening Projects...', '');

    setTimeout(() => {
      this.commandCenter.close();
      this.router.navigate(['/projects']);
    }, 500);
  }

  private showEducation(): void {
    this.append(
      '',
      'Education',
      '',
      'Bachelor of Computer Applications',
      'Kolhan University',
      '2021 - 2024',
      '',
    );
  }

  private showTheme(): void {
    this.append('', `Current Theme : ${this.currentTheme}`, '');
  }

  private clearConsole(): void {
    this.history.set([]);
  }

  private unknownCommand(command: string): void {
    this.append(
      '',
      `Unknown command "${command}"`,
      'Type "help" to view available commands.',
      '',
    );
  }

  private downloadResume(): void {
    if (this.resumeService.isDownloading()) {
      this.append('', 'Resume download already in progress...', '');
      return;
    }

    this.append('', 'Downloading Resume...', '');
    void this.resumeService.download();
  }
  private openGithub(): void {
    this.append('', 'Opening GitHub...', '');
    window.open('https://github.com/ranbirsinghmaan', '_blank');
    setTimeout(() => {
      window.open(
        'https://github.com/MSC0der',
        '_blank',
        'noopener,noreferrer',
      );
    }, 250);
  }

  private openLinkedIn(): void {
    this.append('', 'Opening Linkedin...', '');
    window.open(
      'https://www.linkedin.com/in/ranbir-singh-maan-684035277/',
      '_blank',
      'noopener,noreferrer',
    );
  }

  private goToContact(): void {
    this.append('', 'Navigating to Contact...', '');

    setTimeout(() => {
      this.commandCenter.close();
      this.router.navigate(['/contact']);
    }, 600);
  }

  protected get currentTheme(): string {
    return this.themeService.theme();
  }

  private scrollToBottom(): void {
    requestAnimationFrame(() => {
      const screen = this.terminalScreen?.nativeElement;

      if (!screen) {
        return;
      }

      screen.scrollTo({
        top: screen.scrollHeight,
        behavior: 'smooth',
      });
    });
  }
}
