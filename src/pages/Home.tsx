import { Link } from 'react-router-dom'
import { StatusBadge, Badge } from '@/components/ui/feedback'
import { Button } from '@/components/ui/forms'
import { Card, CardContent } from '@/components/ui/layout'
import { 
  ArrowRightIcon,
  CodeBracketIcon,
  RocketLaunchIcon,
  SparklesIcon,
} from '@heroicons/react/24/outline'

const technologies = [
  'React',
  'Next.js',
  'TypeScript',
  'JavaScript',
  'Tailwind CSS',
  'Node.js',
  'NestJS',
  'Docker',
  'AWS',
  'PostgreSQL',
  'MongoDB',
]

const highlights = [
  {
    icon: CodeBracketIcon,
    title: 'Desenvolvimento Fullstack',
    description: 'Experiência em desenvolvimento de ponta a ponta, desde frontend até backend e infraestrutura.',
  },
  {
    icon: RocketLaunchIcon,
    title: 'Foco em UX',
    description: 'Priorizo a experiência do usuário em cada projeto, criando interfaces intuitivas e agradáveis.',
  },
  {
    icon: SparklesIcon,
    title: 'Soluções Inovadoras',
    description: 'Sempre buscando novas tecnologias e formas de resolver problemas de maneira criativa.',
  },
]

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-6xl mx-auto space-y-16">
        {/* Hero Section */}
        <section>
          <div className="max-w-6xl mx-auto">
            <h1 className="text-5xl md:text-6xl font-bold mb-4 text-center md:text-left text-foreground">
              Fernando Forastieri Neto
            </h1>
            <p className="text-xl md:text-2xl text-foreground mb-6 text-center md:text-left">
              Desenvolvedor Fullstack focado em frontend e experiência do usuário
            </p>
            <p className="text-lg text-foreground mb-8 text-center md:text-left">
              Transformo ideias em soluções digitais elegantes e funcionais. 
              Apaixonado por tecnologia, games e criar experiências que fazem diferença.
            </p>
            <div className="flex flex-wrap gap-2 justify-center md:justify-start mb-8">
              {technologies.map((tech) => (
                <StatusBadge
                  key={tech}
                  status="active"
                  size="sm"
                  className="transition-all hover:scale-110"
                >
                  {tech}
                </StatusBadge>
              ))}
            </div>
            <div className="flex gap-4 justify-center md:justify-start">
              <Link to="/projects">
                <Button size="lg" className="group">
                  Ver Projetos
                  <ArrowRightIcon className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link to="/resume">
                <Button variant="outline" size="lg">
                  Currículo
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* About Section */}
        <section>
          <div className="max-w-6xl mx-auto">
            <h2 className="text-4xl font-bold mb-8 text-center text-foreground">Sobre Mim</h2>
            <div className="space-y-6 text-lg text-foreground">
              <p>
                Primeiramente, sempre tive o pensamento de nunca dividir o profissional do pessoal, a vida é só uma.
                Se eu trabalho com você, você é meu amigo, e se você é meu amigo, isso é o suficiente.
              </p>
              <p>
                <strong>"É muito fácil trabalhar com você"</strong> - essa é a reação que sempre recebo.
                Prezo por um ambiente leve e descontraído antes de qualquer meta, task ou habilidade.
              </p>
              <p>
                Sou desenvolvedor com foco em <strong>frontend</strong> e <strong>experiência do usuário</strong>, 
                sempre buscando criar interfaces que sejam não apenas funcionais, mas também intuitivas e agradáveis.
              </p>
              <p>
                Além do desenvolvimento, tenho uma grande <strong>paixão por games</strong>. Os jogos sempre foram 
                parte importante da minha vida e foram o que me despertaram o interesse inicial pela programação.
              </p>
            </div>
          </div>
        </section>

        {/* Highlights Section */}
        <section>
          <div className="max-w-6xl mx-auto">
            <h2 className="text-4xl font-bold mb-8 text-center text-foreground">O Que Me Diferencia</h2>
            <div className="grid md:grid-cols-3 gap-6">
            {highlights.map((highlight, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="p-3 rounded-lg bg-primary">
                      <highlight.icon className="h-6 w-6 text-primary-foreground" />
                    </div>
                    <h3 className="text-xl font-semibold text-foreground">{highlight.title}</h3>
                  </div>
                  <p className="text-foreground">
                    {highlight.description}
                  </p>
                </CardContent>
              </Card>
            ))}
            </div>
          </div>
        </section>

        {/* Skills Section */}
        <section>
          <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl font-bold mb-8 text-center text-foreground">Capacidades Técnicas</h2>
            <p className="text-lg text-foreground mb-8 text-center">
              Desenvolvedor fullstack com foco em experiência do usuário (UX) e frontend, 
              especializado em NodeJs, Javascript, Typescript e React para desenvolvimento 
              e manutenção de softwares para plataformas web.
            </p>
            <div className="flex flex-wrap gap-3 justify-center">
              {technologies.map((tech) => (
                <Badge key={tech} variant="secondary" className="text-base px-4 py-2">
                  {tech}
                </Badge>
              ))}
            </div>
            <p className="text-sm text-muted-foreground italic text-center mt-6">
              Possuo inglês avançado com capacidade de escrita e fala.
            </p>
          </div>
        </section>

        {/* CTA Section */}
        <section>
          <Card>
            <CardContent className="p-12 text-center">
              <h2 className="text-3xl font-bold mb-4 text-foreground">Vamos Conversar?</h2>
              <p className="text-lg text-foreground mb-8 max-w-2xl mx-auto">
                Quer trabalhar junto ou tem alguma dúvida? Me envie uma mensagem no Twitter!
              </p>
              <a
                href="https://x.com/viciofer"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button size="lg" className="group">
                  <span className="mr-2">𝕏</span>
                  Entrar em Contato
                  <ArrowRightIcon className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </a>
            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  )
}
