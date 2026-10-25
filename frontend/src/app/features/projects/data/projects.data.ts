import { Project } from '../models/project.model';

export const PROJECTS: readonly Project[] = [
  {
    slug: 'security-compliance-system',

    coverImage: '/images/projects/people_vault.webp',

    title: 'PeopleFern',

    category: 'Multi-Tenant HRMS & Workforce SaaS',

    summary:
      'Multi-tenant HR platform covering employee records, attendance, leave, payroll and tasks, with a session-bound, permission-driven, encrypted API.',

    technologies: [
      'Node.js',
      'Express.js',
      'Angular',
      'MySQL',
      'Sequelize',
      'JWT',
      'RBAC',
      'AWS S3',
    ],

    featured: true,
    status: 'ongoing',
    projectType: 'enterprise',
    layout: 'featured',
    availability: 'live',
    liveUrl: 'https://peoplefern.imminentideas.in/home',

    filters: [
      'Backend',
      'Full Stack',
      'Node.js',
      'SQL',
      'Authentication',
    ],

    challenge:
      'Giving many companies one HR platform where every tenant and role sees only the data and features it is entitled to.',

    solution:
      'Session-bound JWT authentication, a permission-management layer and AES-encrypted API payloads over a relational MySQL schema.',

    architecture: [
      'Angular Client',
      'Express API',
      'Auth & Permissions',
      'Sequelize / MySQL',
      'S3 Storage',
    ],
    businessProblem:
      'HR data, leave, attendance and payroll spread across spreadsheets and disconnected tools, with no consistent control over who can see employee records.',

    technicalGoals:
      'One secure multi-tenant API with role and permission control, auditable session handling and consistently validated employee data.',

    role: 'Backend Developer',

    roleDescription:
      'Part of the team from the first commit. Built the employee-data modules (profile, family, education, identity, visa, insurance), request validation and the AES payload layer, then the permission-management and active-session APIs, user hierarchy login and the OpenAPI documentation.',

    duration: 'Feb 2025 – Present',

    teamSize: 'Team project',
    capabilities: [
      {
        title: 'Session-Bound JWT Auth',
        description:
          'Each token carries a per-user random string that is checked against the database on every request, so logout, user switching and forced sign-out invalidate tokens server-side.',
      },

      {
        title: 'Permission Management',
        description:
          'Role and permission APIs, user-hierarchy login and super-admin controls, so each user only reaches the features granted to them.',
      },

      {
        title: 'Encrypted API Payloads',
        description:
          'AES-encrypted request and response bodies controlled by a runtime configuration flag, plus configurable CORS, CSP and X-Frame-Options headers.',
      },

    ],
    engineeringDecisions: [
      {
        code: 'DATA-01',

        title: 'Why move from MongoDB to MySQL?',

        explanation:
          'Client requirements changed mid-project. Payroll, attendance and leave balances are relational data, so the project moved to MySQL with Sequelize models and SQL migrations.',
      },

      {
        code: 'AUTH-02',

        title: 'Why server-bound JWT sessions?',

        explanation:
          'A pure stateless token cannot be revoked. Binding each token to a stored random string lets logout and account switching take effect immediately.',
      },
    ],
    obstacles: [
      {
        obstacle: 'Mid-Project Database Change',

        obstacleDescription:
          'The data layer started on MongoDB and had to change to MySQL after the client revised its requirements.',

        solution: 'Relational Models and Migrations',

        solutionDescription:
          'Moved the data layer to Sequelize models with SQL migrations.',
      },

      {
        obstacle: 'Sensitive Data in Transit',

        obstacleDescription:
          'Employee records and identity documents travel between client and API and needed protection beyond HTTPS.',

        solution: 'Configurable AES Payload Layer',

        solutionDescription:
          'Encrypted request and response bodies through middleware that can be toggled from configuration without redeploying.',
      },
    ],
    metrics: [
      {
        value: '334',
        label: 'Documented Endpoints',

        description: 'Full OpenAPI specification covering every mounted route.',
      },

      {
        value: '70+',
        label: 'Data Models',

        description:
          'Sequelize models spanning HR records, payroll, plans and tasks.',
      },

      {
        value: '60+',
        label: 'API Route Modules',

        description:
          'Employee data, roles, permissions, attendance, leave, payroll and tasks.',
      },
    ],
  },

  {
    slug: 'garage-management-system',

    coverImage: 'images/projects/garage_futurist.webp',
    title: 'Garage Futurist',
    category: 'Multi-Tenant Garage Management SaaS',

    summary:
      'End-to-end garage SaaS: estimates, jobs, invoices, inventory, accounting, reports, real-time chat, subscription billing, payouts and customer reviews, served to a web admin, a staff mobile app and a customer app. Primary backend and Angular developer.',

    technologies: [
      'Node.js',
      'Express.js',
      'Angular 19',
      'MySQL',
      'MongoDB',
      'Socket.IO',
      'Razorpay',
      'AWS S3',
    ],

    featured: true,
    status: 'ongoing',
    projectType: 'enterprise',
    layout: 'featured',
    availability: 'live',
    liveUrl: 'https://garagefuturist.com/',

    filters: [
      'Full Stack',
      'Backend',
      'Angular',
      'Node.js',
      'MongoDB',
      'SQL',
      'Real-Time',
      'Payments',
    ],
    challenge:
      'Running many independent garages on one platform: estimates, jobs, stock, accounting, billing, staff permissions and customer communication, with each garage limited to what its subscription plan allows.',

    solution:
      'A plan-aware permission system, Razorpay subscriptions, add-ons and payouts, Socket.IO chat, Excel imports, a reporting engine, scheduled reminders and WhatsApp, SMS, email and push notifications.',

    architecture: [
      'Angular 19 Admin',
      'Express API (Admin / Mobile / Customer)',
      'Plan & Permission Layer',
      'MySQL / MongoDB',
      'Socket.IO / Cron / Razorpay / S3',
    ],
    businessProblem:
      'Garages tracked jobs, parts, payments and customer follow-ups across paper and disconnected tools, with no clear stock, profit or reminder visibility.',

    technicalGoals:
      'One multi-tenant backend with plan-gated features, accurate billing and invoicing, real-time collaboration and automated reminders across three client apps.',

    role: 'Primary Backend and Angular Developer',

    roleDescription:
      'Built the backend API and a large part of the Angular admin: estimates and jobs, inventory and accounting, reports, coupons, chat, subscription and add-on billing, self-serve signup, reviews, reminders, role and permission checks and Swagger documentation.',

    duration: 'Ongoing',

    teamSize: 'Small team',
    capabilities: [
      {
        title: 'Plan-Aware Permissions',
        description:
          'Permission codes derive from the subscription plan, so a plan change grants or prunes access automatically. Custom roles, grant-permission screens and permission-gated reports sit on top.',
      },

      {
        title: 'Subscription Billing and Payouts',
        description:
          'Razorpay subscriptions, add-ons, card-on-file, plan changes and cancellation, payment links, job payment installments, and Razorpay Route linked accounts with platform fees and payouts.',
      },

      {
        title: 'Secure Direct Uploads',
        description:
          'Images go from the browser straight to a private S3 bucket using short-lived STS AssumeRole credentials, with signed preview URLs. The server only issues credentials and stores the object key.',
      },

      {
        title: 'Hierarchical Password Reset',
        description:
          'Reset requests route up the account hierarchy, with temporary passwords, forced change on first login, configurable expiry and event-driven email.',
      },

      {
        title: 'Core Garage Operations',
        description:
          'Estimates convert to jobs and invoices with customer authorization, plus inventory with Excel import, vendors, purchase orders and expenses.',
      },

      {
        title: 'Reporting Engine',
        description:
          'Sales by customer, item and advisor, inventory valuation, payments received and made, margins and committed stock, with search, sorting, sticky columns and PDF, XLSX, CSV and print export.',
      },

      {
        title: 'Real-Time Chat',
        description:
          'Socket.IO one-to-one and group chat with unread counts, message edit and delete, group management and socket-based session disconnect.',
      },

      {
        title: 'Reminders, Reviews and Messaging',
        description:
          'Scheduled service reminders with sequences, low-stock alerts, review requests with templates, campaigns and event-driven WhatsApp (AiSensy), SMS, email and push messages.',
      },
    ],
    engineeringDecisions: [
      {
        code: 'DATA-01',

        title: 'Why a hybrid MongoDB and MySQL design?',

        explanation:
          'Transactional data such as jobs, invoices and stock sit in MySQL with Sequelize, while document-shaped data uses MongoDB.',
      },

      {
        code: 'BILL-02',

        title: 'Why stage signups before creating accounts?',

        explanation:
          'Self-serve signup is staged in a pending record and provisioned in two steps, so abandoned or failed payments never leave half-created garages.',
      },

      {
        code: 'UPLD-03',

        title: 'Why upload directly to S3 with temporary credentials?',

        explanation:
          'Routing every image through Node wasted bandwidth and made the server a bottleneck. Short-lived STS credentials let browsers upload to a private bucket directly, and a cron job deletes uploads that were never attached to a saved record.',
      },
    ],
    obstacles: [
      {
        obstacle: 'Duplicate Invoices from Payment Events',

        obstacleDescription:
          'Razorpay mandate authentication and charge events could both fire, which risked invoicing the same payment twice.',

        solution: 'Event-Aware Verification',

        solutionDescription:
          'Detected mandate-only authentication in the verify step and handled charged, authenticated and activated events in the webhook so each payment produces one invoice.',
      },

      {
        obstacle: 'Plan Changes Leaving Stale Access',

        obstacleDescription:
          'Upgrading or downgrading a plan left permissions from the old plan behind.',

        solution: 'Plan-Scoped Permission Sync',

        solutionDescription:
          'Pruned permission and group codes on plan change, always created a fresh subscription, and expired trial plans when a paid plan was bought.',
      },
    ],
    metrics: [
      {
        value: '660+',
        label: 'Documented Endpoints',

        description:
          'Across admin, staff mobile and customer Swagger specifications.',
      },

      {
        value: '100+',
        label: 'Data Models',

        description:
          'Sequelize models covering jobs, billing, stock, accounting, chat and reviews.',
      },

      {
        value: '3',
        label: 'Client Apps Served',

        description: 'Web admin, staff mobile app and customer app APIs.',
      },
    ],
  },

  {
    slug: 'real-time-chat-platform',
    title: 'Real-Time Chat Platform',
    category: 'Real-Time Communication',

    summary:
      'Scalable real-time messaging platform supporting multiple users and live communication.',

    technologies: ['Socket.IO', 'Node.js', 'SQL', 'Angular'],

    featured: true,
    status: 'ongoing',
    projectType: 'enterprise',
    layout: 'tall',

    filters: ['Backend', 'Node.js', 'Angular', 'Real-Time', 'Socket.IO'],
  },

  {
    slug: 'maan-saab-portfolio',

    title: 'MAAN SAAB Portfolio',

    coverImage: '/images/projects/maan_saab_portfolio.webp',

    category: 'Personal Engineering Platform',

    summary:
      'Angular 18 engineering portfolio with technical case studies, a multi-theme UI and a Three.js immersive mode, deployed on Cloudflare Pages with a pre-signed S3 resume download.',

    technologies: ['Angular', 'TypeScript', 'SCSS', 'Three.js'],

    featured: true,

    layout: 'featured',

    status: 'completed',

    projectType: 'portfolio',

    filters: ['Angular', 'Frontend', 'Portfolio'],
  },

  {
    slug: 'paradise-getaways',

    title: 'Paradise Getaways',

    category: 'Travel Website',

    layout: 'featured',

    summary:
      'Travel and tourism website focused on destination discovery, booking inquiries and SEO optimization.',

    technologies: ['WordPress', 'Elementor', 'SEO'],

    featured: false,

    status: 'completed',

    projectType: 'client',

    availability: 'retired',

    filters: ['WordPress', 'SEO', 'Travel'],
  },

  {
    slug: 'ilica-shopify-store',

    coverImage: '/images/projects/ilica.webp',

    title: 'Ilica Shopify Store',

    category: 'E-Commerce Platform',

    layout: 'featured',

    summary:
      'Shopify storefront optimized for product presentation and customer conversion.',

    technologies: ['Shopify', 'Liquid', 'E-Commerce'],

    featured: false,

    status: 'completed',

    projectType: 'ecommerce',

    availability: 'retired',

    filters: ['Shopify', 'E-Commerce'],
  },

  {
    slug: 'connex-blue-tech',

    title: 'Connex Blue Tech',

    coverImage: '/images/projects/connex_bluetech.webp',

    category: 'Corporate Website',

    summary:
      'Corporate website focused on business visibility, lead generation and responsive user experience.',

    technologies: ['WordPress', 'Elementor', 'SEO'],

    featured: false,

    status: 'completed',

    projectType: 'client',

    layout: 'standard',

    liveUrl: 'https://connexbluetech.com',
    availability: 'live',

    filters: ['WordPress', 'Corporate', 'SEO'],
  },

  {
    slug: 'imminent-ideas',

    coverImage: '/images/projects/imminent_ideas.webp',

    title: 'Imminent Ideas',

    category: 'Corporate Website',

    layout: 'standard',

    summary:
      'Business website designed for service presentation, branding and customer acquisition.',

    technologies: ['WordPress', 'Elementor'],

    featured: false,

    status: 'completed',

    projectType: 'client',

    liveUrl: 'https://imminentideas.com',
    availability: 'live',

    filters: ['WordPress', 'Corporate'],
  },

  {
    slug: 'adorno-living',

    title: 'Adorno Living',

    coverImage: '/images/projects/adorno_living.webp',

    category: 'Luxury Interior Brand',

    summary:
      'Premium interior and lifestyle brand website focused on visual storytelling and conversions.',

    technologies: ['WordPress', 'WooCommerce'],

    featured: false,

    status: 'completed',

    layout: 'standard',

    projectType: 'ecommerce',

    liveUrl: 'https://www.adornoliving.com',
    availability: 'live',

    filters: ['E-Commerce', 'WordPress'],
  },

  {
    slug: 'denstar-dental',

    coverImage: '/images/projects/denstardental.webp',

    layout: 'standard',

    title: 'Denstar Dental',

    category: 'Healthcare Website',

    summary:
      'Dental clinic website designed to improve online presence and patient engagement.',

    technologies: ['WordPress'],

    featured: false,

    status: 'completed',

    projectType: 'client',

    liveUrl: 'https://denstardental.in',
    availability: 'live',

    filters: ['Healthcare', 'WordPress'],
  },

  {
    slug: 'divine-shiva',

    coverImage: '/images/projects/divine_shiva.webp',

    title: 'Divine Shiva',

    category: 'Business Website',

    layout: 'standard',

    summary:
      'Brand-focused website emphasizing user experience, content presentation and discoverability.',

    technologies: ['WordPress'],

    featured: false,

    status: 'completed',

    projectType: 'client',

    liveUrl: 'https://divineshiva.in',
    availability: 'live',

    filters: ['WordPress', 'Business'],
  },

  {
    slug: 'paperscraft',

    coverImage: '/images/projects/papercrafts.webp',

    title: 'PapersCraft',

    category: 'Business Website',

    layout: 'standard',

    summary:
      'Content and business-focused website with responsive design and SEO-friendly architecture.',

    technologies: ['WordPress', 'SEO'],

    featured: false,

    status: 'completed',

    projectType: 'client',

    availability: 'retired',

    filters: ['WordPress', 'Business', 'SEO'],
  },

  {
    slug: 'stock-market-dashboard',
    title: 'Stock Market Dashboard',
    category: 'Analytics Platform',

    layout: 'standard',

    summary:
      'Real-time financial dashboard displaying stock data, trends and analytics.',

    technologies: ['Angular', 'Node.js', 'MySQL'],

    featured: false,
    status: 'concept',
    projectType: 'concept',

    filters: ['Angular', 'Node.js'],
  },

  {
    slug: 'scalable-url-shortener',
    title: 'Scalable URL Shortener',
    category: 'System Design Project',

    layout: 'standard',

    summary:
      'A scalable URL shortening service focused on performance and distributed architecture.',

    technologies: ['Redis', 'Node.js', 'MongoDB'],

    featured: false,
    status: 'concept',
    projectType: 'concept',

    filters: ['Backend', 'Node.js', 'MongoDB', 'System Design'],
  },

  {
    slug: 'event-booking-platform',
    title: 'Event Booking Platform',
    category: 'Scalable SaaS Application',
    layout: 'wide',

    summary:
      'Modern booking platform designed for scalability and seamless user experience.',

    technologies: ['Angular', 'Node.js', 'MongoDB'],

    featured: false,
    status: 'concept',
    projectType: 'concept',

    filters: ['Angular', 'Node.js', 'MongoDB', 'Full Stack'],
  },
];
