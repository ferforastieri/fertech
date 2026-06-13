import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/config/supabase'

type ResumeRole = {
  position: string
  period: string
  sortOrder: number
}

type Experience = {
  id: string
  company: string
  position: string
  location: string
  period: string
  responsibilities: string[]
  roles?: ResumeRole[]
  sortOrder: number
}

type Education = {
  id: string
  institution: string
  course: string
  location: string
  period: string
  sortOrder: number
}

type ResumeContent = {
  technologies: string[]
  experiences: Experience[]
  education: Education[]
}

type ExperienceRow = {
  id: string
  company: string
  position: string
  location: string
  period: string
  responsibilities: string[]
  sort_order: number
}

type ResumeRoleRow = {
  experience_id: string
  position: string
  period: string
  sort_order: number
}

type EducationRow = {
  id: string
  institution: string
  course: string
  location: string
  period: string
  sort_order: number
}

type ResumeTechnologyRow = {
  name: string
  sort_order: number
}

function mapEducation(row: EducationRow): Education {
  return {
    id: row.id,
    institution: row.institution,
    course: row.course,
    location: row.location,
    period: row.period,
    sortOrder: row.sort_order,
  }
}

function mapRole(row: ResumeRoleRow): ResumeRole {
  return {
    position: row.position,
    period: row.period,
    sortOrder: row.sort_order,
  }
}

function mapExperience(row: ExperienceRow, roles: ResumeRole[]): Experience {
  return {
    id: row.id,
    company: row.company,
    position: row.position,
    location: row.location,
    period: row.period,
    responsibilities: row.responsibilities ?? [],
    roles: roles.length > 0 ? roles : undefined,
    sortOrder: row.sort_order,
  }
}

async function getResumeContent(): Promise<ResumeContent> {
  const [technologiesResult, experiencesResult, rolesResult, educationResult] = await Promise.all([
    supabase.from('resume_technologies').select('name,sort_order').order('sort_order', { ascending: true }),
    supabase.from('resume_experiences').select('id,company,position,location,period,responsibilities,sort_order').order('sort_order', { ascending: true }),
    supabase.from('resume_roles').select('experience_id,position,period,sort_order').order('sort_order', { ascending: true }),
    supabase.from('resume_education').select('id,institution,course,location,period,sort_order').order('sort_order', { ascending: true }),
  ])

  if (technologiesResult.error) throw technologiesResult.error
  if (experiencesResult.error) throw experiencesResult.error
  if (rolesResult.error) throw rolesResult.error
  if (educationResult.error) throw educationResult.error

  const rolesByExperience = new Map<string, ResumeRole[]>()
  ;((rolesResult.data ?? []) as ResumeRoleRow[]).forEach((role) => {
    const roles = rolesByExperience.get(role.experience_id) ?? []
    roles.push(mapRole(role))
    rolesByExperience.set(role.experience_id, roles)
  })

  return {
    technologies: ((technologiesResult.data ?? []) as ResumeTechnologyRow[]).map((item) => item.name),
    experiences: ((experiencesResult.data ?? []) as ExperienceRow[]).map((experience) =>
      mapExperience(experience, rolesByExperience.get(experience.id) ?? []),
    ),
    education: ((educationResult.data ?? []) as EducationRow[]).map(mapEducation),
  }
}

export function useResumeContent() {
  return useQuery({
    queryKey: ['resume', 'content'],
    queryFn: getResumeContent,
  })
}
