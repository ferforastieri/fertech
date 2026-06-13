import { Link } from 'react-router-dom'
import { StatusBadge, Badge } from '@/components/ui/feedback'
import { Button } from '@/components/ui/forms'
import { Card, CardContent } from '@/components/ui/layout'
import { ArrowRightIcon } from '@heroicons/react/24/outline'
import { aboutParagraphs, highlights, profile, technologies } from '@/data/profile'
import { useExperiencePath } from '@/lib/experience'

export default function Home() {
  const modePath = useExperiencePath()

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-6xl mx-auto space-y-12">
        <section>
          <div className="max-w-6xl mx-auto">
            <h1 className="text-5xl md:text-6xl font-bold mb-4 text-center md:text-left text-foreground">
              {profile.name}
            </h1>
            <p className="text-xl md:text-2xl text-foreground mb-6 text-center md:text-left">
              {profile.role}
            </p>
            <p className="text-lg text-foreground mb-8 text-center md:text-left">
              {profile.intro}
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
              <Link to={modePath('/projects')}>
                <Button size="lg" className="group">
                  Ver Projetos
                  <ArrowRightIcon className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link to={modePath('/resume')}>
                <Button variant="outline" size="lg">
                  Currículo
                </Button>
              </Link>
            </div>
          </div>
        </section>

        <section>
          <div className="max-w-6xl mx-auto">
            <h2 className="text-4xl font-bold mb-6 text-center text-foreground">Sobre Mim</h2>
            <div className="space-y-4 text-lg text-foreground">
              {aboutParagraphs.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
          </div>
        </section>

        <section>
          <div className="max-w-6xl mx-auto">
            <h2 className="text-4xl font-bold mb-8 text-center text-foreground">O Que Me Diferencia</h2>
            <div className="grid md:grid-cols-3 gap-6">
              {highlights.map((highlight) => (
                <Card key={highlight.title} className="hover:shadow-lg transition-shadow">
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

        <section>
          <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl font-bold mb-6 text-center text-foreground">Capacidades Técnicas</h2>
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

        <section>
          <Card>
            <CardContent className="p-12 text-center">
              <h2 className="text-3xl font-bold mb-4 text-foreground">Vamos Conversar?</h2>
              <p className="text-lg text-foreground mb-8 max-w-2xl mx-auto">
                Quer trabalhar junto ou tem alguma dúvida? Me envie uma mensagem no Twitter!
              </p>
              <a
                href={profile.contactUrl}
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
