import { useLocation } from 'react-router-dom'
import { Seo } from './Seo'

type RouteSeoConfig = {
  title: string
  description: string
  canonicalPath?: string
  type?: 'website' | 'article' | 'profile'
}

const routeSeo: Array<[RegExp, RouteSeoConfig | ((pathname: string) => RouteSeoConfig)]> = [
  [
    /^\/$/,
    {
      title: 'Escolha sua experiencia',
      description:
        'Portfolio de Fernando Forastieri Neto com modo tradicional, experiencia Aurora, projetos, artigos, curriculo e playground WebGL.',
      canonicalPath: '/',
    },
  ],
  [
    /^\/classic\/?$/,
    {
      title: 'Portfolio tradicional',
      description:
        'Portfolio tradicional de Fernando Forastieri Neto, desenvolvedor fullstack com foco em design systems, infraestrutura e arquitetura de produtos digitais.',
      canonicalPath: '/classic',
      type: 'profile',
    },
  ],
  [
    /^\/aurora\/?$/,
    {
      title: 'Portfolio Aurora',
      description:
        'Experiencia imersiva do portfolio de Fernando Forastieri Neto com projetos, artigos, curriculo e interfaces animadas.',
      canonicalPath: '/aurora',
      type: 'profile',
    },
  ],
  [
    /^\/(?:classic\/|aurora\/)?projects\/?$/,
    {
      title: 'Projetos',
      description:
        'Projetos de Fernando Forastieri Neto com detalhes tecnicos, arquitetura, tecnologias utilizadas e links configuraveis.',
      canonicalPath: '/projects',
    },
  ],
  [
    /^\/(?:classic\/|aurora\/)?projects\/([^/]+)\/?$/,
    (pathname) => ({
      title: 'Detalhes do projeto',
      description:
        'Pagina detalhada de projeto com contexto, arquitetura, tecnologias, modulos e links configurados no painel.',
      canonicalPath: pathname.replace(/^\/(?:classic|aurora)/, ''),
    }),
  ],
  [
    /^\/(?:classic\/|aurora\/)?blog\/?$/,
    {
      title: 'Artigos',
      description:
        'Artigos sobre frontend, arquitetura, design systems, infraestrutura e produtos digitais.',
      canonicalPath: '/blog',
    },
  ],
  [
    /^\/(?:classic\/|aurora\/)?blog\/([^/]+)\/?$/,
    (pathname) => ({
      title: 'Artigo',
      description:
        'Artigo tecnico de Fernando Forastieri Neto sobre desenvolvimento, arquitetura e produto digital.',
      canonicalPath: pathname.replace(/^\/(?:classic|aurora)/, ''),
      type: 'article',
    }),
  ],
  [
    /^\/(?:classic\/|aurora\/)?resume\/?$/,
    {
      title: 'Curriculo',
      description:
        'Curriculo de Fernando Forastieri Neto com experiencia profissional, formacao, competencias e tecnologias.',
      canonicalPath: '/resume',
      type: 'profile',
    },
  ],
  [
    /^\/aurora\/playground\/?$/,
    {
      title: 'Playground WebGL',
      description:
        'Playground WebGL com mini games, experimentos visuais, interacoes animadas e composicoes 3D.',
      canonicalPath: '/aurora/playground',
    },
  ],
]

function getRouteSeo(pathname: string): RouteSeoConfig {
  const match = routeSeo.find(([pattern]) => pattern.test(pathname))
  const fallback = {
    title: 'Portfolio',
    description:
      'Portfolio de Fernando Forastieri Neto com projetos, artigos, curriculo e experiencias interativas.',
    canonicalPath: pathname,
  }

  if (!match) return fallback

  const [, config] = match
  return typeof config === 'function' ? config(pathname) : config
}

export function RouteSeo() {
  const { pathname } = useLocation()
  const seo = getRouteSeo(pathname)

  return <Seo {...seo} />
}
