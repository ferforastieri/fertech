import { Card, CardContent, CardDescription, CardHeader, CardTitle, Accordion } from '@/components/ui/layout'
import { Badge } from '@/components/ui/feedback'
import { ArrowTopRightOnSquareIcon } from '@heroicons/react/24/outline'

type Project = {
  title: string
  description: string
  logo: string
  tags: string[]
  url?: string
}

// Projetos Atuais
const currentProjects = [
  {
    title: 'Atacte',
    description:
      'Aplicativo de segurança familiar para servidor pessoal. Criado após problemas com Bitwarden, oferece gerenciamento de senhas criptografadas, autenticação 2FA, notas seguras e rastreamento de localização familiar. Interface web em Vue.js 3 e app mobile em React Native com Expo.',
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

// Império Cerveja (Gold)
const imperioCervejaProjects = [
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

// Sherwin Williams (SW e Experiências)
const sherwinWilliamsProjects = [
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

// Projetos Menores
const otherProjects = [
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

function ProjectCard({ project }: { project: Project }) {
  const cardContent = (
    <Card className={`h-full transition-all duration-300 ${project.url ? 'hover:shadow-xl hover:-translate-y-2 cursor-pointer' : ''}`}>
      <CardHeader>
        <div className="flex items-start gap-4 mb-4">
          {project.logo && (
            <div className="w-16 h-16 rounded-lg bg-card border border-border flex items-center justify-center flex-shrink-0 overflow-hidden">
              <img
                src={project.logo}
                alt={project.title}
                className="object-contain p-2 w-full h-full"
              />
            </div>
          )}
          <div className="flex-1">
            <div className="flex items-start justify-between gap-2">
              <CardTitle className={`text-2xl transition-colors text-foreground ${project.url ? 'group-hover:underline' : ''}`}>
                {project.title}
              </CardTitle>
              {project.url && (
                <ArrowTopRightOnSquareIcon className="h-5 w-5 text-foreground group-hover:scale-110 transition-transform flex-shrink-0 mt-1" />
              )}
            </div>
          </div>
        </div>
        <CardDescription className="text-base leading-relaxed text-foreground">
          {project.description}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-2">
          {project.tags.map((tag) => (
            <Badge key={tag} variant="outline">
              {tag}
            </Badge>
          ))}
        </div>
      </CardContent>
    </Card>
  )

  if (project.url) {
    return (
      <a
        href={project.url}
        target="_blank"
        rel="noopener noreferrer"
        className="block group"
      >
        {cardContent}
      </a>
    )
  }

  return <div className="block">{cardContent}</div>
}

function ProjectSection({ projects }: { projects: Project[] }) {
  return (
    <div className="grid md:grid-cols-2 gap-8">
      {projects.map((project, index) => (
        <ProjectCard key={index} project={project} />
      ))}
    </div>
  )
}

export default function Projects() {
  const accordionItems = [
    {
      value: 'current',
      trigger: `Projetos Atuais (${currentProjects.length})`,
      content: <ProjectSection projects={currentProjects} />,
      defaultOpen: true,
    },
    {
      value: 'imperio',
      trigger: `Império Cerveja (Gold) (${imperioCervejaProjects.length})`,
      content: <ProjectSection projects={imperioCervejaProjects} />,
      defaultOpen: true,
    },
    {
      value: 'sherwin',
      trigger: `Sherwin Williams (SW e Experiências) (${sherwinWilliamsProjects.length})`,
      content: <ProjectSection projects={sherwinWilliamsProjects} />,
      defaultOpen: true,
    },
    {
      value: 'others',
      trigger: `Outros Projetos (${otherProjects.length})`,
      content: <ProjectSection projects={otherProjects} />,
      defaultOpen: true,
    },
  ]

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold mb-4 text-foreground">Meus Projetos</h1>
          <p className="text-xl text-foreground max-w-2xl mx-auto">
            Uma seleção dos projetos em que trabalhei e contribuí ao longo dos anos
          </p>
        </div>

        <Accordion 
          type="multiple" 
          items={accordionItems}
          className="space-y-4"
        />
      </div>
    </div>
  )
}
