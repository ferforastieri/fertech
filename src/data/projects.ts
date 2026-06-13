export type Project = {
  title: string
  description: string
  logo: string
  tags: string[]
  url?: string
}

export type ProjectGroup = {
  id: string
  title: string
  projects: Project[]
}

export const personalProjects: Project[] = [
  {
    title: 'FerTech',
    description:
      'Este site: portfólio pessoal em React, TypeScript e Tailwind CSS, com modo tradicional, experiência imersiva, dark mode e animações WebGL.',
    url: 'https://github.com/ferforastieri/fertech',
    logo: '/logo.png',
    tags: ['React', 'TypeScript', 'Tailwind CSS', 'Vite', 'React Router', 'Three.js'],
  },
  {
    title: 'Atacte',
    description:
      'Gerenciador de senhas e notas seguras para servidor pessoal, com criptografia AES-256, 2FA/TOTP, aplicação web e mobile.',
    url: 'https://github.com/ferforastieri/atacte',
    logo: '/logos/atacte.png',
    tags: ['Vue.js 3', 'React Native', 'Expo', 'TypeScript', 'Node.js', 'Express', 'PostgreSQL', 'Prisma'],
  },
  {
    title: 'Valk UI',
    description:
      'Biblioteca moderna de componentes UI para React com TypeScript, CLI interativo, suporte a dark mode e componentes customizáveis.',
    url: 'https://valkui.vercel.app',
    logo: '/logos/valk-ui.png',
    tags: ['React', 'TypeScript', 'Tailwind CSS', 'CLI', 'Design System'],
  },
]

export const imperioCervejaProjects: Project[] = [
  {
    title: 'Vendedor Gold',
    description:
      'Sistema para força de vendas com app mobile, painel web, backend NestJS, rotas, clientes, pedidos, metas e relatórios operacionais.',
    url: 'https://vendedorgold.com.br',
    logo: '/logos/vendedor-gold.png',
    tags: ['React Native', 'Expo', 'React', 'TypeScript', 'NestJS', 'TypeORM', 'PostgreSQL'],
  },
  {
    title: 'Parceiro Gold / ClienteRei',
    description:
      'Plataforma para parceiros e distribuidores com app mobile, web administrativo, gestão de clientes, campanhas, estoque e indicadores.',
    url: 'https://parceirogold.com.br',
    logo: '/logos/parceiro-gold.png',
    tags: ['React Native', 'Expo', 'React', 'TypeScript', 'Express', 'Prisma', 'PostgreSQL'],
  },
  {
    title: 'Garçom Rei',
    description:
      'Programa de fidelidade e gestão para garçons, com pontos, resgates, campanhas, PDVs e relatórios financeiros.',
    logo: '/logos/garcom-rei.png',
    tags: ['PHP', 'MySQL', 'JavaScript'],
  },
  {
    title: 'Império Delivery',
    description:
      'Ecossistema de delivery com aplicações web/mobile, monorepo, componentes compartilhados, regras de pedido e infraestrutura de operação.',
    logo: '/logos/imperio-cerveja.png',
    tags: ['React', 'React Native', 'TypeScript', 'Node.js', 'Monorepo', 'Turborepo'],
  },
  {
    title: 'WhatsApp ParceiroGold',
    description:
      'Serviço de mensageria e automações para ParceiroGold, com NestJS, Prisma e integrações para fluxos operacionais via WhatsApp.',
    logo: '/logos/parceiro-gold.png',
    tags: ['NestJS', 'TypeScript', 'Prisma', 'WhatsApp', 'PostgreSQL'],
  },
  {
    title: 'Vendedor Gold IA Backend',
    description:
      'Backend de IA e automações para apoiar fluxos do Vendedor Gold, com serviços Python, scripts, testes e integrações de dados.',
    logo: '/logos/vendedor-gold.png',
    tags: ['Python', 'FastAPI', 'IA', 'Automação', 'Testes'],
  },
]

export const sherwinWilliamsProjects: Project[] = [
  {
    title: 'Clube Pro Pintor',
    description:
      'Sistema de fidelidade, catálogo e gestão para pintores, com frontend React, backend Express, campanhas, produtos e resgates.',
    url: 'https://clubepropintor.com.br',
    logo: '/logos/sherwin-williams.png',
    tags: ['React 16', 'Redux', 'Express', 'Sequelize', 'MySQL'],
  },
  {
    title: 'Experiências SW',
    description:
      'Plataforma de experiências, campanhas, prêmios e resgates para programas Sherwin Williams.',
    url: 'https://experiencias-sw.com.br',
    logo: '/logos/experiencias-sw.png',
    tags: ['React 16', 'Redux', 'Express', 'Sequelize', 'MySQL'],
  },
  {
    title: 'SW Dashboard',
    description:
      'Dashboard analítico para visualização de indicadores, métricas, relatórios e dados operacionais em tempo real.',
    logo: '/logos/sw-dashboard.png',
    tags: ['React 18', 'TypeScript', 'Charts', 'Dashboard'],
  },
  {
    title: 'SW Recomenda',
    description:
      'Sistema de recomendações e relacionamento com frontend React/Angular/Ionic, backend NestJS e Prisma.',
    logo: '/logos/sw-recomenda.png',
    tags: ['React 18', 'Angular', 'Ionic', 'TypeScript', 'NestJS', 'Prisma'],
  },
  {
    title: 'SW Integration',
    description:
      'API REST de integração para sistemas Sherwin Williams, com autenticação, documentação e contratos entre plataformas.',
    logo: '/logos/sw-integration.png',
    tags: ['NestJS', 'TypeScript', 'Swagger', 'Prisma', 'API REST'],
  },
  {
    title: 'SW Club',
    description:
      'Nova plataforma de clube/fidelidade Sherwin Williams com backend NestJS, Prisma e frontend React moderno.',
    logo: '/logos/sherwin-williams.png',
    tags: ['React', 'TypeScript', 'NestJS', 'Prisma', 'Tailwind CSS'],
  },
]

export const cocaColaProjects: Project[] = [
  {
    title: 'Embaixadores Coca-Cola',
    description:
      'Plataforma de campanhas e embaixadores com gestão administrativa, participantes, imagens, relatórios e operações.',
    logo: '/logos/coca-cola.png',
    tags: ['React 16', 'Redux', 'Express', 'Sequelize', 'MySQL'],
  },
]

export const otherCompanyProjects: Project[] = [
  {
    title: 'GabrielPro',
    description:
      'Plataforma institucional e administrativa com front em Next.js, backend Express/Prisma e arquitetura orientada a casos de uso.',
    url: 'https://gabrielpro.com.br',
    logo: '/logos/gabrielpro.png',
    tags: ['Next.js 12', 'React 17', 'TypeScript', 'Express', 'Prisma'],
  },
  {
    title: 'Clube Grendene',
    description:
      'Programa de fidelidade e pontos com gestão de campanhas, participantes, prêmios e resgates.',
    logo: '/logos/grendene.png',
    tags: ['React 16', 'Redux', 'Express', 'Sequelize', 'MySQL'],
  },
  {
    title: 'GudPoints',
    description:
      'Sistema de pontos e recompensas com gestão de prêmios, campanhas promocionais, resgates e relatórios administrativos.',
    url: 'https://gudpoints.com.br',
    logo: '/logos/gudpoints.png',
    tags: ['React 16', 'Redux', 'Express', 'Sequelize', 'MySQL'],
  },
  {
    title: 'iD / Inhotim',
    description:
      'Projeto de experiências e campanhas, com frontend em Next.js, backend Express/Prisma, SSR e rotinas administrativas.',
    logo: '/logos/inhotim-id.png',
    tags: ['Next.js 12', 'React 17', 'TypeScript', 'Express', 'Prisma'],
  },
  {
    title: 'Legrand',
    description:
      'Sistema de gestão, catálogo e benefícios com interface React, Material UI, estado global e sincronização de dados via React Query.',
    url: 'https://legrandmaisvantagens.com.br',
    logo: '/logos/legrand.png',
    tags: ['React 18', 'TypeScript', 'Material-UI', 'Zustand', 'React Query'],
  },
  {
    title: 'LeoPlus',
    description:
      'Programa de fidelidade com parcerias, integrações com múltiplas APIs, frontend React e backend NestJS/Prisma.',
    url: 'https://leoplus.com.br',
    logo: '/logos/leoplus.png',
    tags: ['React 18', 'TypeScript', 'Material-UI', 'NestJS', 'Prisma', 'React Query'],
  },
  {
    title: 'Clube Morelli',
    description:
      'Programa de pontos e benefícios com campanhas, prêmios, resgates e área administrativa.',
    url: 'https://clubemorelli.com.br',
    logo: '/logos/morelli.png',
    tags: ['React 16', 'Redux', 'Express', 'Sequelize', 'MySQL'],
  },
  {
    title: 'Smart Backoffice',
    description:
      'Ferramenta interna Smart para gestão administrativa, usuários, dashboards, relatórios e suporte operacional.',
    logo: '/logos/smart-backoffice.png',
    tags: ['React 18', 'TypeScript', 'Tailwind CSS', 'NestJS', 'TypeORM', 'PostgreSQL'],
  },
  {
    title: 'Parceiro Blum',
    description:
      'Sistema de gestão e programa de fidelidade com backend Laravel, frontend Vue e banco MySQL.',
    logo: '/logos/parceiro-blum.png',
    tags: ['Laravel 5.8', 'Vue.js 2.5', 'PHP', 'MySQL'],
  },
]

export const projectGroups: ProjectGroup[] = [
  { id: 'personal', title: 'Projetos próprios', projects: personalProjects },
  { id: 'imperio', title: 'Império Cerveja', projects: imperioCervejaProjects },
  { id: 'sherwin', title: 'Sherwin Williams', projects: sherwinWilliamsProjects },
  { id: 'coca-cola', title: 'Coca-Cola', projects: cocaColaProjects },
  { id: 'others', title: 'Outras empresas', projects: otherCompanyProjects },
]

export const allProjects = projectGroups.flatMap((group) => group.projects)

export const currentProjects = personalProjects
export const smartClientProjects = [
  ...imperioCervejaProjects,
  ...sherwinWilliamsProjects,
  ...cocaColaProjects,
  ...otherCompanyProjects,
]
