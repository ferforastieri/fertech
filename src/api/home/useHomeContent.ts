import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/config/supabase/client'

export type HomeStackGroup = {
  title: string
  items: string[]
}

export type HomeContent = {
  heroEyebrow: string
  heroHeadline: string
  heroDescription: string
  projectsButtonLabel: string
  resumeButtonLabel: string
  contactButtonLabel: string
  stackGroups: HomeStackGroup[]
  classicAboutTitle: string
  classicHighlightsTitle: string
  classicCapabilitiesTitle: string
  languageNote: string
  auroraAboutEyebrow: string
  auroraAboutTitle: string
  projectsEyebrow: string
  projectsTitle: string
  projectsLinkLabel: string
  projectsTotalLabel: string
  blogEyebrow: string
  blogTitle: string
  contactTitle: string
  contactDescription: string
}

type HomeContentRow = {
  hero_eyebrow: string
  hero_headline: string
  hero_description: string
  projects_button_label: string
  resume_button_label: string
  contact_button_label: string
  stack_groups: HomeStackGroup[]
  classic_about_title: string
  classic_highlights_title: string
  classic_capabilities_title: string
  language_note: string
  aurora_about_eyebrow: string
  aurora_about_title: string
  projects_eyebrow: string
  projects_title: string
  projects_link_label: string
  projects_total_label: string
  blog_eyebrow: string
  blog_title: string
  contact_title: string
  contact_description: string
}

function mapHomeContent(row: HomeContentRow): HomeContent {
  return {
    heroEyebrow: row.hero_eyebrow,
    heroHeadline: row.hero_headline,
    heroDescription: row.hero_description,
    projectsButtonLabel: row.projects_button_label,
    resumeButtonLabel: row.resume_button_label,
    contactButtonLabel: row.contact_button_label,
    stackGroups: row.stack_groups,
    classicAboutTitle: row.classic_about_title,
    classicHighlightsTitle: row.classic_highlights_title,
    classicCapabilitiesTitle: row.classic_capabilities_title,
    languageNote: row.language_note,
    auroraAboutEyebrow: row.aurora_about_eyebrow,
    auroraAboutTitle: row.aurora_about_title,
    projectsEyebrow: row.projects_eyebrow,
    projectsTitle: row.projects_title,
    projectsLinkLabel: row.projects_link_label,
    projectsTotalLabel: row.projects_total_label,
    blogEyebrow: row.blog_eyebrow,
    blogTitle: row.blog_title,
    contactTitle: row.contact_title,
    contactDescription: row.contact_description,
  }
}

async function getHomeContent(): Promise<HomeContent> {
  const { data, error } = await supabase
    .from('home_content')
    .select(`
      hero_eyebrow,
      hero_headline,
      hero_description,
      projects_button_label,
      resume_button_label,
      contact_button_label,
      stack_groups,
      classic_about_title,
      classic_highlights_title,
      classic_capabilities_title,
      language_note,
      aurora_about_eyebrow,
      aurora_about_title,
      projects_eyebrow,
      projects_title,
      projects_link_label,
      projects_total_label,
      blog_eyebrow,
      blog_title,
      contact_title,
      contact_description
    `)
    .eq('id', 'main')
    .single()

  if (error) throw error

  return mapHomeContent(data as HomeContentRow)
}

export function useHomeContent() {
  return useQuery({
    queryKey: ['home', 'main'],
    queryFn: getHomeContent,
  })
}
