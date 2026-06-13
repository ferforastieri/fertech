export type ArchitectureNode = {
  name: string
  description: string
  technologies: string[]
}

export type ProjectArchitecture = {
  id: string
  name: string
  summary: string
  accent: string
  layers: {
    clients: ArchitectureNode[]
    services: ArchitectureNode[]
    platform: ArchitectureNode[]
  }
  folders: string[]
}

export const projectArchitectures: ProjectArchitecture[] = [
  {
    id: 'vendedor-gold',
    name: 'Vendedor Gold',
    summary: 'Ecossistema de vendas com web, aplicativo offline-first, API modular, tempo real, notificações e um núcleo separado de IA.',
    accent: '#f5b942',
    layers: {
      clients: [
        {
          name: 'Aplicativo de vendas',
          description: 'Rotas, visitas, pedidos, geolocalização, sincronização local e notificações.',
          technologies: ['Expo', 'React Native', 'React Query', 'SQLite', 'Zustand'],
        },
        {
          name: 'Backoffice Web',
          description: 'Operação, dashboards, produtos, vendedores, pedidos e campanhas.',
          technologies: ['React', 'Vite', 'React Query', 'Socket.io', 'Zod'],
        },
      ],
      services: [
        {
          name: 'API comercial',
          description: 'Domínios de vendedores, clientes, pedidos, produtos, unidades e notificações.',
          technologies: ['NestJS', 'TypeORM', 'WebSockets', 'Cloud Tasks'],
        },
        {
          name: 'Gold IA',
          description: 'Agentes, busca vetorial, sessões, sugestões e base de conhecimento.',
          technologies: ['FastAPI', 'LangGraph', 'OpenAI', 'SQLAlchemy'],
        },
      ],
      platform: [
        {
          name: 'Dados operacionais',
          description: 'Persistência relacional e integrações com bases externas.',
          technologies: ['PostgreSQL', 'SQL Server', 'MongoDB'],
        },
        {
          name: 'Memória e mensageria',
          description: 'Checkpoints de agentes, cache, tarefas e eventos de aplicativo.',
          technologies: ['Redis', 'pgvector', 'Firebase', 'Google Cloud'],
        },
      ],
    },
    folders: [
      'mobile/src/{app,modules,services,api,hooks}',
      'web/src/{pages,components,api,contexts}',
      'backend/src/{seller,order,product,notification,goldia}',
      'ia/app/{api,use_cases,adapters,services}',
      'ia/database/alembic',
    ],
  },
  {
    id: 'imperio-delivery',
    name: 'Império Delivery',
    summary: 'Monorepo de delivery com aplicativo, painel web, API transacional, tipos compartilhados e infraestrutura GCP declarada em Terraform.',
    accent: '#ff5a36',
    layers: {
      clients: [
        {
          name: 'Aplicativo do cliente',
          description: 'Catálogo, carrinho, localização, pagamento, pedidos e acompanhamento em tempo real.',
          technologies: ['Expo', 'React Native', 'React Query', 'Maps', 'Zustand'],
        },
        {
          name: 'Painel administrativo',
          description: 'Gestão de catálogo, parceiros, entregadores, finanças e conteúdo.',
          technologies: ['React', 'Vike', 'Vite', 'UI Valk', 'Chart.js'],
        },
      ],
      services: [
        {
          name: 'API de delivery',
          description: 'Pedidos, pagamentos, catálogo, cupons, usuários, permissões e notificações.',
          technologies: ['NestJS', 'TypeORM', 'Socket.io', 'JWT'],
        },
        {
          name: 'Processamento assíncrono',
          description: 'Webhooks, conciliação, expiração de pagamentos e entregas push.',
          technologies: ['Cloud Tasks', 'Mercado Pago', 'Firebase'],
        },
      ],
      platform: [
        {
          name: 'Plataforma de dados',
          description: 'Banco privado, cache e armazenamento público e privado.',
          technologies: ['Cloud SQL', 'PostgreSQL', 'Memorystore', 'Cloud Storage'],
        },
        {
          name: 'Infraestrutura como código',
          description: 'Rede, segredos, execução, balanceamento, DNS e ambientes.',
          technologies: ['Terraform', 'Cloud Run', 'VPC', 'Secret Manager'],
        },
      ],
    },
    folders: [
      'apps/mobile/src',
      'apps/web/src',
      'apps/api/src/{modules,infrastructure,common}',
      'packages/shared/src',
      'infra/terraform/{envs,modules}',
    ],
  },
  {
    id: 'parceiro-gold',
    name: 'Parceiro Gold',
    summary: 'Automação conversacional que recebe webhooks do WhatsApp, conduz jornadas e produz peças personalizadas em tempo real.',
    accent: '#36d399',
    layers: {
      clients: [
        {
          name: 'WhatsApp Business',
          description: 'Entrada da conversa, escolhas guiadas e entrega das peças geradas.',
          technologies: ['WhatsApp Cloud API', 'Webhooks'],
        },
      ],
      services: [
        {
          name: 'Orquestrador de conversa',
          description: 'Controla tickets, etapas, respostas e regras específicas de campanha.',
          technologies: ['NestJS', 'Axios', 'RxJS'],
        },
        {
          name: 'Gerador visual',
          description: 'Compõe preços, telefones e variações sobre templates de campanha.',
          technologies: ['Canvas', 'Jimp', 'Fontes customizadas'],
        },
      ],
      platform: [
        {
          name: 'Persistência da jornada',
          description: 'Registra tickets, mensagens e estado das conversas.',
          technologies: ['Prisma', 'Banco relacional'],
        },
        {
          name: 'Catálogo de mídia',
          description: 'Templates, imagens geradas e scripts de geração em lote.',
          technologies: ['PNG', 'JPEG', 'Node.js scripts'],
        },
      ],
    },
    folders: [
      'src/{config,helpers,image-generators,scripts}',
      'src/app.controller.ts',
      'src/app.service.ts',
      'prisma',
      'img/generated',
      'fonts',
    ],
  },
  {
    id: 'sw-club',
    name: 'SW Club',
    summary: 'Plataforma de relacionamento e benefícios com painel web, API modular, permissões, conteúdo, vendas, resgates e cursos.',
    accent: '#4fb3ff',
    layers: {
      clients: [
        {
          name: 'Portal administrativo',
          description: 'Operação de parceiros, vendas, prêmios, cursos, banners e indicadores.',
          technologies: ['React', 'Vite', 'React Query', 'UI Valk', 'Chart.js'],
        },
      ],
      services: [
        {
          name: 'API de benefícios',
          description: 'Módulos de parceiros, vendas, resgates, prêmios, produtos, lojas e cursos.',
          technologies: ['NestJS', 'Prisma', 'JWT', 'Swagger'],
        },
        {
          name: 'Serviços transversais',
          description: 'Permissões, tarefas, certificados, e-mail, sanitização e observabilidade.',
          technologies: ['PDFKit', 'ZeptoMail', 'Loki', 'Helmet'],
        },
      ],
      platform: [
        {
          name: 'Persistência',
          description: 'Banco relacional modelado via Prisma e trilhas de auditoria.',
          technologies: ['Prisma', 'PostgreSQL'],
        },
        {
          name: 'Arquivos e mídia',
          description: 'Uploads, imagens, certificados e conteúdos de campanhas.',
          technologies: ['S3', 'DigitalOcean Spaces', 'Jimp'],
        },
      ],
    },
    folders: [
      'web/src/{pages,components,api,routes}',
      'backend/src/{parceiros,vendas,resgates,premios}',
      'backend/src/{cursos,produtos,notificacoes}',
      'backend/src/shared/{guards,jobs,logs}',
      'backend/src/shared/infrastructure/{database,storage,email}',
    ],
  },
]
