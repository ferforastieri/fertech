import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/config/supabase/client'
import { localizeRow, TranslationMap } from '@/api/i18n/translations'
import { Locale, useLanguage } from '@/contexts/language/LanguageContext'

export type ResumeRole = {
  position: string
  period: string
  sortOrder: number
}

export type Experience = {
  id: string
  company: string
  position: string
  location: string
  period: string
  responsibilities: string[]
  roles?: ResumeRole[]
  sortOrder: number
}

export type Education = {
  id: string
  institution: string
  course: string
  location: string
  period: string
  sortOrder: number
}

export type ResumeSectionKey = 'about' | 'education' | 'experience' | 'skills' | 'languages' | 'projects'

export type ResumeLanguage = {
  name: string
  description: string
}

export type ResumeSection = {
  key: ResumeSectionKey
  title: string
  enabled: boolean
}

export type ResumeContent = {
  technologies: string[]
  experiences: Experience[]
  education: Education[]
  aboutParagraphs: string[]
  languages: ResumeLanguage[]
  sections: ResumeSection[]
  location: string
  downloadLabel: string
  generatingLabel: string
  pdfFilename: string
  projectTechnologiesLabel: string
}

type ExperienceRow = {
  id: string
  company: string
  position: string
  location: string
  period: string
  responsibilities: string[]
  sort_order: number
  translations: TranslationMap<Experience> | null
}

type ResumeRoleRow = {
  experience_id: string
  position: string
  period: string
  sort_order: number
  translations: TranslationMap<ResumeRole> | null
}

type EducationRow = {
  id: string
  institution: string
  course: string
  location: string
  period: string
  sort_order: number
  translations: TranslationMap<Education> | null
}

type ResumeTechnologyRow = {
  name: string
  sort_order: number
}

type ResumeSettingsRow = {
  about_paragraphs: string[]
  languages: ResumeLanguage[]
  sections: ResumeSection[]
  location: string
  download_label: string
  generating_label: string
  pdf_filename: string
  project_technologies_label: string
  translations: TranslationMap<Omit<ResumeContent, 'technologies' | 'experiences' | 'education'>> | null
}

function mapEducation(row: EducationRow, locale: Locale): Education {
  const base = {
    id: row.id,
    institution: row.institution,
    course: row.course,
    location: row.location,
    period: row.period,
    sortOrder: row.sort_order,
  }

  return localizeRow(base, row.translations, locale, `resume_education/${row.id}`)
}

function mapRole(row: ResumeRoleRow, locale: Locale): ResumeRole {
  const base = {
    position: row.position,
    period: row.period,
    sortOrder: row.sort_order,
  }

  return localizeRow(base, row.translations, locale, `resume_roles/${row.experience_id}/${row.sort_order}`)
}

function mapExperience(row: ExperienceRow, roles: ResumeRole[], locale: Locale): Experience {
  const base = {
    id: row.id,
    company: row.company,
    position: row.position,
    location: row.location,
    period: row.period,
    responsibilities: row.responsibilities ?? [],
    roles: roles.length > 0 ? roles : undefined,
    sortOrder: row.sort_order,
  }

  return localizeRow(base, row.translations, locale, `resume_experiences/${row.id}`)
}

async function getResumeContent(locale: Locale): Promise<ResumeContent> {
  const [technologiesResult, experiencesResult, rolesResult, educationResult, settingsResult] = await Promise.all([
    supabase.from('resume_technologies').select('name,sort_order').order('sort_order', { ascending: true }),
    supabase.from('resume_experiences').select('id,company,position,location,period,responsibilities,sort_order,translations').order('sort_order', { ascending: true }),
    supabase.from('resume_roles').select('experience_id,position,period,sort_order,translations').order('sort_order', { ascending: true }),
    supabase.from('resume_education').select('id,institution,course,location,period,sort_order,translations').order('sort_order', { ascending: true }),
    supabase
      .from('resume_settings')
      .select('about_paragraphs,languages,sections,location,download_label,generating_label,pdf_filename,project_technologies_label,translations')
      .eq('id', 'main')
      .single(),
  ])

  if (technologiesResult.error) throw technologiesResult.error
  if (experiencesResult.error) throw experiencesResult.error
  if (rolesResult.error) throw rolesResult.error
  if (educationResult.error) throw educationResult.error
  if (settingsResult.error) throw settingsResult.error

  const settings = settingsResult.data as ResumeSettingsRow

  const rolesByExperience = new Map<string, ResumeRole[]>()
  ;((rolesResult.data ?? []) as ResumeRoleRow[]).forEach((role) => {
    const roles = rolesByExperience.get(role.experience_id) ?? []
    roles.push(mapRole(role, locale))
    rolesByExperience.set(role.experience_id, roles)
  })

  const baseSettings = {
    technologies: ((technologiesResult.data ?? []) as ResumeTechnologyRow[]).map((item) => item.name),
    experiences: ((experiencesResult.data ?? []) as ExperienceRow[]).map((experience) =>
      mapExperience(experience, rolesByExperience.get(experience.id) ?? [], locale),
    ),
    education: ((educationResult.data ?? []) as EducationRow[]).map((education) => mapEducation(education, locale)),
    aboutParagraphs: settings.about_paragraphs,
    languages: settings.languages,
    sections: settings.sections,
    location: settings.location,
    downloadLabel: settings.download_label,
    generatingLabel: settings.generating_label,
    pdfFilename: settings.pdf_filename,
    projectTechnologiesLabel: settings.project_technologies_label,
  }

  return localizeRow(baseSettings, settings.translations, locale, 'resume_settings/main')
}

export function useResumeContent() {
  const { locale } = useLanguage()

  return useQuery({
    queryKey: ['resume', 'content', locale],
    queryFn: () => getResumeContent(locale),
  })
}
