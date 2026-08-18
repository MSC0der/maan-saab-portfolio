import { Project } from '../models/project.model';

export const PROJECTS: readonly Project[] = [
  {
    slug: 'security-compliance-system',

    coverImage: '/images/projects/people_vault.jpeg',

    title: 'Security Compliance System',

    category: 'Enterprise Security Platform',

    summary:
      'Built a secure compliance management platform with JWT authentication, RBAC, validation layers and scalable backend architecture.',

    technologies: [
      'Node.js',
      'Express.js',
      'Angular',
      'MongoDB',
      'SQL',
      'JWT',
      'RBAC',
    ],

    featured: true,
    status: 'completed',
    projectType: 'enterprise',
    layout: 'featured',

    filters: [
      'Backend',
      'Full Stack',
      'Node.js',
      'MongoDB',
      'SQL',
      'Authentication',
    ],

    challenge:
      'Managing secure access control, audit logging and compliance requirements across enterprise systems.',

    solution:
      'Implemented JWT authentication, RBAC authorization, modular APIs and audit tracking architecture.',

    architecture: [
      'Angular Client',
      'API Layer',
      'Authentication',
      'RBAC',
      'MongoDB',
    ],
    businessProblem:
      'Fragmented user management systems leading to compliance risks and unauthorized access across enterprise applications.',

    technicalGoals:
      'Centralize authentication, implement RBAC authorization and maintain immutable audit trails.',

    role: 'Lead Backend Architect',

    roleDescription:
      'Architecture design, API implementation, security reviews and system design.',

    duration: '8 Months',

    teamSize: '4 Engineers',
    capabilities: [
      {
        title: 'Stateless JWT Auth',
        description:
          'Distributed authentication using signed JWT tokens for secure and scalable access control.',
      },

      {
        title: 'Hierarchical RBAC',
        description:
          'Role inheritance and permission matrices implemented through middleware driven authorization.',
      },

      {
        title: 'Audit Logging',
        description:
          'Complete activity tracking for compliance and forensic analysis.',
      },
    ],
    engineeringDecisions: [
      {
        code: 'INFRA-01',

        title: 'Why Node.js for a Security Layer?',

        explanation:
          'Node.js enabled high throughput authentication processing while keeping the technology stack unified.',
      },

      {
        code: 'DATA-04',

        title: 'Why MongoDB for Audit Logs?',

        explanation:
          'MongoDB provided schema flexibility and efficient storage for large audit datasets.',
      },
    ],
    obstacles: [
      {
        obstacle: 'Token Bloat & Latency',

        obstacleDescription:
          'Large JWT payloads increased request size and slowed mobile clients.',

        solution: 'Hybrid Claims Model',

        solutionDescription:
          'Store only identity and high-level roles inside JWT while resolving detailed permissions through cache.',
      },

      {
        obstacle: 'Role Explosion',

        obstacleDescription:
          'Managing thousands of permissions became difficult for administrators.',

        solution: 'Functional Permission Groups',

        solutionDescription:
          'Grouped permissions into business capabilities for easier management.',
      },
    ],
    metrics: [
      {
        value: '99.99%',
        label: 'System Availability',

        description:
          'Achieved through redundancy and scalable deployment architecture.',
      },

      {
        value: '0',
        label: 'Unauthorized Access',

        description:
          'Successful penetration testing confirmed perimeter integrity.',
      },

      {
        value: '~60%',
        label: 'Developer Efficiency',

        description: 'Security middleware accelerated feature development.',
      },
    ],
  },

  {
    slug: 'garage-management-system',

    coverImage: 'images/projects/garage_futurist.png',
    title: 'Garage Management System',
    category: 'Business Management Platform',

    summary:
      'Role-based garage management solution with workflow automation, inventory management and optimized database operations.',

    technologies: ['Node.js', 'Angular', 'MongoDB', 'MySQL'],

    featured: true,
    status: 'completed',
    projectType: 'enterprise',
    layout: 'featured',

    filters: ['Full Stack', 'Angular', 'Node.js', 'MongoDB'],
    challenge:
      'Managing inventory, vehicles, users and workflow permissions across multiple garage operations.',

    solution:
      'Implemented hybrid MongoDB and MySQL architecture with RBAC workflows and optimized database queries.',
  },

  {
    slug: 'real-time-chat-platform',
    title: 'Real-Time Chat Platform',
    category: 'Real-Time Communication',

    summary:
      'Scalable real-time messaging platform supporting multiple users and live communication.',

    technologies: ['Socket.IO', 'Node.js', 'SQL', 'Angular'],

    featured: false,
    status: 'completed',
    projectType: 'enterprise',
    layout: 'tall',

    filters: ['Backend', 'Node.js', 'Angular', 'Real-Time', 'Socket.IO'],
  },

  {
    slug: 'maan-saab-portfolio',

    title: 'MAAN SAAB Portfolio',

    coverImage: '/images/projects/maan_saab_portfolio.png',

    category: 'Personal Engineering Platform',

    summary:
      'Modern portfolio platform built with Angular SSR, responsive architecture and technical case-study driven design.',

    technologies: ['Angular', 'TypeScript', 'SCSS', 'SSR'],

    featured: true,

    layout: 'featured',

    status: 'ongoing',

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

    featured: true,

    status: 'completed',

    projectType: 'client',

    liveUrl: 'https://paradisegetaways.co.nz',

    filters: ['WordPress', 'SEO', 'Travel'],
  },

  {
    slug: 'ilica-shopify-store',

    coverImage: '/images/projects/ilica.png',

    title: 'Ilica Shopify Store',

    category: 'E-Commerce Platform',

    layout: 'featured',

    summary:
      'Shopify storefront optimized for product presentation and customer conversion.',

    technologies: ['Shopify', 'Liquid', 'E-Commerce'],

    featured: true,

    status: 'completed',

    projectType: 'ecommerce',

    liveUrl: 'https://ilica-shop.myshopify.com',

    filters: ['Shopify', 'E-Commerce'],
  },

  {
    slug: 'connex-blue-tech',

    title: 'Connex Blue Tech',

    coverImage: '/images/projects/connex_bluetech.png',

    category: 'Corporate Website',

    summary:
      'Corporate website focused on business visibility, lead generation and responsive user experience.',

    technologies: ['WordPress', 'Elementor', 'SEO'],

    featured: false,

    status: 'completed',

    projectType: 'client',

    layout: 'standard',

    liveUrl: 'https://connexbluetech.com',

    filters: ['WordPress', 'Corporate', 'SEO'],
  },

  {
    slug: 'imminent-ideas',

    coverImage: '/images/projects/imminent_ideas.png',

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

    filters: ['WordPress', 'Corporate'],
  },

  {
    slug: 'adorno-living',

    title: 'Adorno Living',

    coverImage: '/images/projects/adorno_living.png',

    category: 'Luxury Interior Brand',

    summary:
      'Premium interior and lifestyle brand website focused on visual storytelling and conversions.',

    technologies: ['WordPress', 'WooCommerce'],

    featured: false,

    status: 'completed',

    layout: 'standard',

    projectType: 'ecommerce',

    liveUrl: 'https://www.adornoliving.com',

    filters: ['E-Commerce', 'WordPress'],
  },

  {
    slug: 'denstar-dental',

    coverImage: '/images/projects/denstardental.png',

    layout: 'standard',

    title: 'Denstar Dental',

    category: 'Healthcare Website',

    summary:
      'Dental clinic website designed to improve online presence and patient engagement.',

    technologies: ['WordPress'],

    featured: false,

    status: 'completed',

    projectType: 'client',

    liveUrl: 'https:///denstardental.in/denstardental.in',

    filters: ['Healthcare', 'WordPress'],
  },

  {
    slug: 'divine-shiva',

    coverImage: '/images/projects/divine_shiva.png',

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

    filters: ['WordPress', 'Business'],
  },

  {
    slug: 'paperscraft',

    coverImage: '/images/projects/papercrafts.png',

    title: 'PapersCraft',

    category: 'Business Website',

    layout: 'standard',

    summary:
      'Content and business-focused website with responsive design and SEO-friendly architecture.',

    technologies: ['WordPress', 'SEO'],

    featured: false,

    status: 'completed',

    projectType: 'client',

    liveUrl: 'https://www.paperscraft.in',

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
