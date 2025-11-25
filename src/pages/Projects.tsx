import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/layout'
import { Badge } from '@/components/feedback'
import { ArrowTopRightOnSquareIcon } from '@heroicons/react/24/outline'

const projects = [
  {
    title: 'Vendedor Gold - Império Cerveja',
    description:
      'Sistema completo de gestão para vendedores da Império Cerveja. Desenvolvido em React Native com TypeScript, backend robusto em NestJS e interface web em React.',
    url: 'https://vendedorgold.com.br',
    logo: '/sellergold-logo-DDxGLlDM.png',
    tags: ['React Native', 'TypeScript', 'NestJS', 'React'],
  },
  {
    title: 'Parceiro Gold - Império Cerveja',
    description:
      'Plataforma mobile para distribuidores da Império Cerveja, disponível na Play Store. Sistema de gestão de distribuição, controle de estoque e dashboard analítico.',
    url: 'https://parceirogold.com.br',
    logo: '/pglogosite-3bf9bf64.png',
    tags: ['React Native', 'TypeScript', 'NestJS'],
  },
  {
    title: 'GabrielPro - Arquitetura',
    description:
      'Site institucional e portfólio para empresa de arquitetura. Desenvolvido em Next.js com TypeScript, implementando Clean Architecture e Use Cases.',
    url: 'https://gabrielpro.com.br',
    logo: '/logo-gabrielpro.png',
    tags: ['Next.js', 'TypeScript', 'Clean Architecture'],
  },
  {
    title: 'Ecossistema Sherwin Williams',
    description:
      'Sistema completo de gestão de cores e produtos para Sherwin Williams. Aplicativo mobile em Ionic, backend em JavaScript e versão web responsiva.',
    url: 'https://clubepropintor.com.br',
    logo: '/logo-dark.png',
    tags: ['Ionic', 'JavaScript', 'React'],
  },
]

export default function Projects() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold mb-4 text-black dark:text-white">Meus Projetos</h1>
          <p className="text-xl text-black dark:text-white max-w-2xl mx-auto">
            Uma seleção dos projetos em que trabalhei e contribuí ao longo dos anos
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {projects.map((project, index) => (
            <a
              key={index}
              href={project.url}
              target="_blank"
              rel="noopener noreferrer"
              className="block group"
            >
              <Card className="h-full hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border-2 border-black dark:border-white bg-white dark:bg-black">
                <CardHeader>
                  <div className="flex items-start gap-4 mb-4">
                    {project.logo && (
                      <div className="w-16 h-16 rounded-lg bg-white dark:bg-black border-2 border-black dark:border-white flex items-center justify-center flex-shrink-0 overflow-hidden">
                        <img
                          src={project.logo}
                          alt={project.title}
                          className="object-contain p-2 w-full h-full"
                        />
                      </div>
                    )}
                    <div className="flex-1">
                      <div className="flex items-start justify-between gap-2">
                        <CardTitle className="text-2xl group-hover:underline transition-colors text-black dark:text-white">
                          {project.title}
                        </CardTitle>
                        <ArrowTopRightOnSquareIcon className="h-5 w-5 text-black dark:text-white group-hover:scale-110 transition-transform flex-shrink-0 mt-1" />
                      </div>
                    </div>
                  </div>
                  <CardDescription className="text-base leading-relaxed text-black dark:text-white">
                    {project.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {project.tags.map((tag) => (
                      <Badge key={tag} variant="outline" className="border border-black dark:border-white text-black dark:text-white bg-white dark:bg-black">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </a>
          ))}
        </div>
      </div>
    </div>
  )
}
