import { Link } from 'react-router-dom'
import { StatusBadge, Badge, Skeleton } from '@/components/ui/feedback'
import { Button } from '@/components/ui/forms'
import { Card, CardContent } from '@/components/ui/layout'
import { ArrowRightIcon, CodeBracketIcon, RocketLaunchIcon, SparklesIcon } from '@heroicons/react/24/outline'
import { useExperiencePath } from '@/lib/experience'
import { ProfileHighlight, useProfileContent } from '@/api/profile/useProfileContent'
import { useHomeContent } from '@/api/home/useHomeContent'

const highlightIcons = {
  code: CodeBracketIcon,
  rocket: RocketLaunchIcon,
  sparkles: SparklesIcon,
}

function getHighlightIcon(highlight: ProfileHighlight) {
  return highlightIcons[highlight.icon] ?? SparklesIcon
}

export default function Home() {
  const modePath = useExperiencePath()
  const profileQuery = useProfileContent()
  const homeQuery = useHomeContent()
  const profileContent = profileQuery.data
  const homeContent = homeQuery.data
  const isLoading = profileQuery.isLoading || homeQuery.isLoading

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 pt-4 pb-12">
        <div className="mx-auto max-w-6xl space-y-12">
          <section className="space-y-5">
            <Skeleton className="h-14 w-full max-w-xl" />
            <Skeleton className="h-8 w-full max-w-md" />
            <Skeleton className="h-6 w-full max-w-3xl" />
            <div className="flex flex-wrap gap-2">
              {Array.from({ length: 9 }).map((_, index) => (
                <Skeleton key={index} className="h-8 w-24 rounded-full" />
              ))}
            </div>
            <div className="flex gap-4">
              <Skeleton className="h-12 w-36 rounded-lg" />
              <Skeleton className="h-12 w-32 rounded-lg" />
            </div>
          </section>
          <section className="space-y-4">
            <Skeleton className="mx-auto h-10 w-56" />
            <Skeleton className="h-5 w-full" />
            <Skeleton className="h-5 w-11/12" />
            <Skeleton className="h-5 w-10/12" />
          </section>
          <section className="grid gap-6 md:grid-cols-3">
            {Array.from({ length: 3 }).map((_, index) => (
              <Skeleton key={index} className="h-44 rounded-lg" />
            ))}
          </section>
        </div>
      </div>
    )
  }

  if (profileQuery.error || homeQuery.error || !profileContent || !homeContent) {
    return (
      <div className="container mx-auto px-4 pt-4 pb-12">
        <div className="max-w-6xl mx-auto text-foreground">Nao foi possivel carregar o conteudo.</div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 pt-4 pb-12">
      <div className="max-w-6xl mx-auto space-y-12">
        <section>
          <div className="max-w-6xl mx-auto">
            <h1 className="text-5xl md:text-6xl font-bold mb-4 text-center md:text-left text-foreground">
              {profileContent.name}
            </h1>
            <p className="text-xl md:text-2xl text-foreground mb-6 text-center md:text-left">
              {profileContent.role}
            </p>
            <p className="text-lg text-foreground mb-8 text-center md:text-left">
              {profileContent.intro}
            </p>
            <div className="flex flex-wrap gap-2 justify-center md:justify-start mb-8">
              {profileContent.technologies.map((tech) => (
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
                  {homeContent.projectsButtonLabel}
                  <ArrowRightIcon className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link to={modePath('/resume')}>
                <Button variant="outline" size="lg">
                  {homeContent.resumeButtonLabel}
                </Button>
              </Link>
            </div>
          </div>
        </section>

        <section>
          <div className="max-w-6xl mx-auto">
            <h2 className="text-4xl font-bold mb-6 text-center text-foreground">{homeContent.classicAboutTitle}</h2>
            <div className="space-y-4 text-lg text-foreground">
              {profileContent.aboutParagraphs.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
          </div>
        </section>

        <section>
          <div className="max-w-6xl mx-auto">
            <h2 className="text-4xl font-bold mb-8 text-center text-foreground">{homeContent.classicHighlightsTitle}</h2>
            <div className="grid md:grid-cols-3 gap-6">
              {profileContent.highlights.map((highlight) => {
                const Icon = getHighlightIcon(highlight)
                return (
                  <Card key={highlight.title} className="hover:shadow-lg transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-center gap-4 mb-4">
                        <div className="p-3 rounded-lg bg-primary">
                          <Icon className="h-6 w-6 text-primary-foreground" />
                        </div>
                        <h3 className="text-xl font-semibold text-foreground">{highlight.title}</h3>
                      </div>
                      <p className="text-foreground">
                        {highlight.description}
                      </p>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </div>
        </section>

        <section>
          <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl font-bold mb-6 text-center text-foreground">{homeContent.classicCapabilitiesTitle}</h2>
            <div className="flex flex-wrap gap-3 justify-center">
              {profileContent.technologies.map((tech) => (
                <Badge key={tech} variant="secondary" className="text-base px-4 py-2">
                  {tech}
                </Badge>
              ))}
            </div>
            <p className="text-sm text-muted-foreground italic text-center mt-6">
              {homeContent.languageNote}
            </p>
          </div>
        </section>

        <section>
          <Card>
            <CardContent className="p-12 text-center">
              <h2 className="text-3xl font-bold mb-4 text-foreground">{homeContent.contactTitle}</h2>
              <p className="text-lg text-foreground mb-8 max-w-2xl mx-auto">
                {homeContent.contactDescription}
              </p>
              <a
                href={profileContent.contactUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button size="lg" className="group">
                  <span className="mr-2">𝕏</span>
                  {homeContent.contactButtonLabel}
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
