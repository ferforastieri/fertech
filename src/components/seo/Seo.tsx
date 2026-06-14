import { useEffect } from 'react'

type JsonLd = Record<string, unknown> | Record<string, unknown>[]

type SeoProps = {
  title: string
  description: string
  canonicalPath?: string
  image?: string
  type?: 'website' | 'article' | 'profile'
  jsonLd?: JsonLd
}

const SITE_NAME = 'Fernando Forastieri Neto | FerTech'
const DEFAULT_IMAGE = '/logo.png'

function getOrigin() {
  if (typeof window === 'undefined') return ''
  return window.location.origin
}

function absoluteUrl(path: string) {
  const origin = getOrigin()
  if (!origin) return path
  return new URL(path, origin).toString()
}

function setMeta(attribute: 'name' | 'property', key: string, content: string) {
  let element = document.head.querySelector<HTMLMetaElement>(`meta[${attribute}="${key}"]`)

  if (!element) {
    element = document.createElement('meta')
    element.setAttribute(attribute, key)
    document.head.appendChild(element)
  }

  element.content = content
}

function setCanonical(href: string) {
  let element = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]')

  if (!element) {
    element = document.createElement('link')
    element.rel = 'canonical'
    document.head.appendChild(element)
  }

  element.href = href
}

function setJsonLd(data: JsonLd) {
  const scriptId = 'route-jsonld'
  let element = document.head.querySelector<HTMLScriptElement>(`script[data-seo="${scriptId}"]`)

  if (!element) {
    element = document.createElement('script')
    element.type = 'application/ld+json'
    element.dataset.seo = scriptId
    document.head.appendChild(element)
  }

  element.textContent = JSON.stringify(data)
}

export function Seo({
  title,
  description,
  canonicalPath,
  image = DEFAULT_IMAGE,
  type = 'website',
  jsonLd,
}: SeoProps) {
  useEffect(() => {
    const pageUrl = absoluteUrl(canonicalPath ?? window.location.pathname)
    const imageUrl = absoluteUrl(image)
    const fullTitle = title.includes('Fernando') ? title : `${title} | ${SITE_NAME}`
    const defaultJsonLd = {
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'Person',
          '@id': `${getOrigin()}/#person`,
          name: 'Fernando Forastieri Neto',
          jobTitle: 'Desenvolvedor Fullstack',
          url: getOrigin(),
        },
        {
          '@type': 'WebSite',
          '@id': `${getOrigin()}/#website`,
          name: SITE_NAME,
          url: getOrigin(),
          inLanguage: 'pt-BR',
        },
        {
          '@type': 'WebPage',
          '@id': `${pageUrl}#webpage`,
          name: fullTitle,
          description,
          url: pageUrl,
          isPartOf: { '@id': `${getOrigin()}/#website` },
          about: { '@id': `${getOrigin()}/#person` },
          inLanguage: 'pt-BR',
        },
      ],
    }

    document.title = fullTitle
    setCanonical(pageUrl)

    setMeta('name', 'description', description)
    setMeta('name', 'robots', 'index, follow')
    setMeta('name', 'author', 'Fernando Forastieri Neto')

    setMeta('property', 'og:site_name', SITE_NAME)
    setMeta('property', 'og:title', fullTitle)
    setMeta('property', 'og:description', description)
    setMeta('property', 'og:type', type)
    setMeta('property', 'og:url', pageUrl)
    setMeta('property', 'og:image', imageUrl)
    setMeta('property', 'og:locale', 'pt_BR')

    setMeta('name', 'twitter:card', 'summary_large_image')
    setMeta('name', 'twitter:title', fullTitle)
    setMeta('name', 'twitter:description', description)
    setMeta('name', 'twitter:image', imageUrl)

    setJsonLd(jsonLd ?? defaultJsonLd)
  }, [canonicalPath, description, image, jsonLd, title, type])

  return null
}
