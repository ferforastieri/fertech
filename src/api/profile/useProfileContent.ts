import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/config/supabase'

export type ProfileHighlight = {
  icon: 'code' | 'rocket' | 'sparkles'
  title: string
  description: string
}

type ProfileContent = {
  name: string
  role: string
  intro: string
  contactUrl: string
  technologies: string[]
  aboutParagraphs: string[]
  highlights: ProfileHighlight[]
}

type ProfileRow = {
  id: string
  name: string
  role: string
  intro: string
  contact_url: string
  technologies: string[]
  about_paragraphs: string[]
  highlights: ProfileHighlight[]
}

function mapProfile(row: ProfileRow): ProfileContent {
  return {
    name: row.name,
    role: row.role,
    intro: row.intro,
    contactUrl: row.contact_url,
    technologies: row.technologies ?? [],
    aboutParagraphs: row.about_paragraphs ?? [],
    highlights: row.highlights ?? [],
  }
}

async function getProfileContent(): Promise<ProfileContent> {
  const { data, error } = await supabase
    .from('profile')
    .select('id,name,role,intro,contact_url,technologies,about_paragraphs,highlights')
    .eq('id', 'main')
    .single()

  if (error) throw error

  return mapProfile(data as ProfileRow)
}

export function useProfileContent() {
  return useQuery({
    queryKey: ['profile', 'main'],
    queryFn: getProfileContent,
  })
}
