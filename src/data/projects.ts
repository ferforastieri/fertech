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

export const currentProjects: Project[] = [
  {
    title: 'FerTech',
    description:
      'Este Site! Portfólio pessoal desenvolvido com React, TypeScript e Tailwind CSS. Interface moderna e responsiva com suporte a dark mode.',
    url: 'https://github.com/ferforastieri/fertech',
    logo: '/logo.png',
    tags: ['React', 'TypeScript', 'Tailwind CSS', 'Vite', 'React Router'],
  },
  {
    title: 'Atacte',
    description:
      'Gerenciador de senhas e notas seguras para servidor pessoal. Criptografia AES-256, 2FA/TOTP e interface moderna.',
    url: 'https://github.com/ferforastieri/atacte',
    logo: '/logos/atacte.png',
    tags: ['Vue.js 3', 'React Native', 'Expo', 'TypeScript', 'Node.js', 'Express', 'PostgreSQL', 'Prisma'],
  },
  {
    title: 'Valk UI',
    description:
      'Biblioteca moderna de componentes UI para React com TypeScript. Inclui CLI interativo, suporte a dark mode, e componentes totalmente customizáveis.',
    url: 'https://valkui.vercel.app',
    logo: '/logos/valk-ui.png',
    tags: ['React', 'TypeScript', 'Tailwind CSS', 'CLI'],
  },
]

export const imperioCervejaProjects: Project[] = [
  {
    title: 'Vendedor Gold - Império Cerveja',
    description:
      'Sistema completo de gestão para vendedores. App mobile em React Native com TypeScript, interface web em React 18, backend NestJS com TypeORM e PostgreSQL. Gestão de pedidos, rotas, clientes e relatórios.',
    url: 'https://vendedorgold.com.br',
    logo: '/logos/vendedor-gold.png',
    tags: ['React Native', 'React 18', 'TypeScript', 'NestJS', 'TypeORM', 'PostgreSQL'],
  },
  {
    title: 'Parceiro Gold - Império Cerveja',
    description:
      'Plataforma para distribuidores com app mobile em React Native. Interface web em React 18 com Material-UI, backend Express e Fastify com MySQL. Controle de estoque, distribuição e dashboard analítico.',
    url: 'https://parceirogold.com.br',
    logo: '/logos/parceiro-gold.png',
    tags: ['React Native', 'React 18', 'TypeScript', 'Material-UI', 'Express', 'Fastify', 'MySQL'],
  },
  {
    title: 'Garçom Rei - Império Cerveja',
    description:
      'Sistema de gestão e programa de fidelidade para garçons. Desenvolvido em PHP com MySQL, interface web responsiva. Gestão de pontos, resgates, controle de PDVs e relatórios financeiros.',
    logo: '/logos/garcom-rei.png',
    tags: ['PHP', 'MySQL', 'JavaScript'],
  },
]

export const sherwinWilliamsProjects: Project[] = [
  {
    title: 'Clube Pro Pintor - SW',
    description:
      'Sistema completo de gestão de cores e produtos. App mobile em Ionic, interface web em React 16 com Redux, backend Express com Sequelize e MySQL. Catálogo de produtos, gestão de cores e programa de fidelidade.',
    url: 'https://clubepropintor.com.br',
    logo: '/logos/sw.png',
    tags: ['Ionic', 'React 16', 'Redux', 'Express', 'Sequelize', 'MySQL'],
  },
  {
    title: 'Experiências SW',
    description:
      'Plataforma de experiências e programas de fidelidade. Interface web em React 16 com Redux para gerenciamento de estado, backend Express com Sequelize e MySQL. Campanhas, prêmios e resgates.',
    url: 'https://experiencias-sw.com.br',
    logo: '/logos/experiencias-sw.png',
    tags: ['React 16', 'Redux', 'Express', 'Sequelize', 'MySQL'],
  },
  {
    title: 'SW Dashboard',
    description:
      'Dashboard analítico e de métricas. Interface web em React 18 com TypeScript para visualização de dados, gráficos e relatórios em tempo real.',
    logo: '/logos/sw-dashboard.png',
    tags: ['React 18', 'TypeScript'],
  },
  {
    title: 'SW Recomenda',
    description:
      'Sistema de recomendações e sugestões. Frontend React 18 com TypeScript, backend NestJS com Prisma ORM. Algoritmos de recomendação personalizados para produtos e campanhas.',
    logo: '/logos/sw-recomenda.png',
    tags: ['React 18', 'TypeScript', 'NestJS', 'Prisma'],
  },
  {
    title: 'SW Integration',
    description:
      'API REST de integração para sistemas Sherwin Williams. Backend NestJS com TypeScript, documentação Swagger/OpenAPI, Prisma ORM para gerenciamento de dados e autenticação JWT.',
    logo: '/logos/sw-integration.png',
    tags: ['NestJS', 'TypeScript', 'Swagger', 'Prisma'],
  },
]

export const otherProjects: Project[] = [
  {
    title: 'GabrielPro - Arquitetura',
    description:
      'Site institucional e portfólio para empresa de arquitetura. Desenvolvido em Next.js 12 com TypeScript, implementando Clean Architecture e Use Cases.',
    url: 'https://gabrielpro.com.br',
    logo: '/logos/gabrielpro.png',
    tags: ['Next.js 12', 'React 17', 'TypeScript', 'Express', 'Prisma'],
  },
  {
    title: 'Clube Grendene',
    description:
      'Programa de fidelidade e pontos. Interface web React 16 com Redux para gerenciamento de estado, backend Express.js com Sequelize ORM e MySQL. Gestão de pontos, prêmios e resgates.',
    logo: '/logos/grendene.png',
    tags: ['React 16', 'Redux', 'Express', 'Sequelize', 'MySQL'],
  },
  {
    title: 'GudPoints',
    description:
      'Sistema de pontos e recompensas. Frontend React 16 com Redux, backend Express.js com Sequelize ORM e MySQL. Gestão de prêmios, campanhas promocionais e resgates.',
    url: 'https://gudpoints.com.br',
    logo: '/logos/gudpoints.png',
    tags: ['React 16', 'Redux', 'Express', 'Sequelize', 'MySQL'],
  },
  {
    title: 'iD - Inhotim',
    description:
      'Plataforma de experiências e campanhas. Frontend Next.js 12 com TypeScript e SSR, backend Express.js com Prisma ORM. Gestão de campanhas, experiências e relatórios.',
    logo: '/logos/id.png',
    tags: ['Next.js 12', 'React 17', 'TypeScript', 'Express', 'Prisma'],
  },
  {
    title: 'Legrand',
    description:
      'Sistema de gestão e catálogo de produtos. Interface React 18 com TypeScript, Material-UI para componentes, Zustand para estado global e React Query para cache de dados.',
    url: 'https://legrandmaisvantagens.com.br',
    logo: '/logos/legrand.png',
    tags: ['React 18', 'TypeScript', 'Material-UI', 'Zustand', 'React Query'],
  },
  {
    title: 'LeoPlus',
    description:
      'Programa de fidelidade com parcerias. Frontend React 18 com TypeScript, Material-UI, Zustand para estado e React Query para sincronização. Integração com múltiplos parceiros via APIs.',
    url: 'https://leoplus.com.br',
    logo: '/logos/leoplus.png',
    tags: ['React 18', 'TypeScript', 'Material-UI', 'Zustand', 'React Query'],
  },
  {
    title: 'Clube Morelli',
    description:
      'Programa de pontos e benefícios. Interface React 16 com Redux, backend Express.js com Sequelize ORM e MySQL. Gestão de campanhas, prêmios e resgates.',
    url: 'https://clubemorelli.com.br',
    logo: '/logos/morelli.png',
    tags: ['React 16', 'Redux', 'Express', 'Sequelize', 'MySQL'],
  },
  {
    title: 'Smart Backoffice',
    description:
      'Painel administrativo e gestão de sistemas. Frontend React 18 com TypeScript e Tailwind CSS, backend NestJS com TypeORM e PostgreSQL. Dashboard, relatórios e gestão de usuários.',
    logo: '/logos/smart-backoffice.png',
    tags: ['React 18', 'TypeScript', 'Tailwind CSS', 'NestJS', 'TypeORM', 'PostgreSQL'],
  },
  {
    title: 'Parceiro Blum',
    description:
      'Sistema de gestão e programa de fidelidade. Backend Laravel 5.8 (PHP), frontend Vue.js 2.5, banco MySQL. Gestão de pontos, resgates e relatórios administrativos.',
    logo: '/logos/parceiro-blum.png',
    tags: ['Laravel 5.8', 'Vue.js 2.5', 'PHP', 'MySQL'],
  },
]

export const projectGroups: ProjectGroup[] = [
  { id: 'current', title: 'Projetos Atuais', projects: currentProjects },
  { id: 'imperio', title: 'Império Cerveja (Gold)', projects: imperioCervejaProjects },
  { id: 'sherwin', title: 'Sherwin Williams (SW e Experiências)', projects: sherwinWilliamsProjects },
  { id: 'others', title: 'Outros Projetos', projects: otherProjects },
]

export const allProjects = projectGroups.flatMap((group) => group.projects)
