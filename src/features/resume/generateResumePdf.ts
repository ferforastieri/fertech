import type { ProfileContent } from '@/api/profile/useProfileContent'
import type { Project } from '@/api/projects/useProjectGroups'
import type { ResumeContent, ResumeSectionKey } from '@/api/resume/useResumeContent'

type GenerateResumePdfInput = {
  profile: ProfileContent
  resume: ResumeContent
  projects: Project[]
}

export async function generateResumePdf({ profile, resume, projects }: GenerateResumePdfInput) {
  const { jsPDF } = await import('jspdf')
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' })
  const pageWidth = doc.internal.pageSize.getWidth()
  const pageHeight = doc.internal.pageSize.getHeight()
  const margin = 15
  const maxWidth = pageWidth - margin * 2
  let yPosition = margin

  const ensureSpace = (height = 24) => {
    if (yPosition > pageHeight - height) {
      doc.addPage()
      yPosition = margin
    }
  }

  const sectionTitle = (title: string) => {
    ensureSpace(26)
    doc.setFontSize(14)
    doc.setFont('helvetica', 'bold')
    doc.text(title.toUpperCase(), margin, yPosition)
    yPosition += 6
    doc.setLineWidth(0.5)
    doc.line(margin, yPosition, pageWidth - margin, yPosition)
    yPosition += 5
  }

  doc.setFontSize(20)
  doc.setFont('helvetica', 'bold')
  doc.text(profile.name.toUpperCase(), pageWidth / 2, yPosition, { align: 'center' })
  yPosition += 8

  doc.setFontSize(12)
  doc.setFont('helvetica', 'normal')
  doc.text(profile.role, pageWidth / 2, yPosition, { align: 'center' })
  yPosition += 6

  doc.setFontSize(10)
  const socialText = profile.socialLinks.map((social) => `${social.name}: ${social.href.replace(/^https?:\/\//, '')}`).join(' | ')
  doc.text(socialText || profile.contactUrl, pageWidth / 2, yPosition, { align: 'center' })
  yPosition += 5
  doc.text(resume.location, pageWidth / 2, yPosition, { align: 'center' })
  yPosition += 10

  const renderSection: Record<ResumeSectionKey, (title: string) => void> = {
    about: (title) => {
      sectionTitle(title)
      doc.setFontSize(10)
      doc.setFont('helvetica', 'normal')
      resume.aboutParagraphs.forEach((paragraph) => {
        ensureSpace(16)
        const lines = doc.splitTextToSize(paragraph, maxWidth)
        doc.text(lines, margin, yPosition)
        yPosition += lines.length * 4 + 4
      })
    },
    experience: (title) => {
      sectionTitle(title)
      resume.experiences.forEach((experience) => {
        ensureSpace(40)
        doc.setFontSize(12)
        doc.setFont('helvetica', 'bold')
        doc.text(doc.splitTextToSize(experience.position, maxWidth - 50), margin, yPosition)
        doc.setFontSize(10)
        doc.setFont('helvetica', 'normal')
        doc.text(experience.period, pageWidth - margin, yPosition, { align: 'right' })
        yPosition += 6
        doc.setFontSize(11)
        doc.setFont('helvetica', 'italic')
        doc.text(`${experience.company} | ${experience.location}`, margin, yPosition)
        yPosition += 6
        experience.roles?.forEach((role) => {
          ensureSpace(12)
          doc.setFontSize(10)
          doc.setFont('helvetica', 'bold')
          doc.text(`• ${role.position}`, margin + 5, yPosition)
          doc.setFont('helvetica', 'normal')
          doc.text(role.period, pageWidth - margin, yPosition, { align: 'right' })
          yPosition += 5
        })
        if (experience.roles?.length) yPosition += 2
        doc.setFontSize(10)
        doc.setFont('helvetica', 'normal')
        experience.responsibilities.forEach((responsibility) => {
          ensureSpace(14)
          const lines = doc.splitTextToSize(`• ${responsibility}`, maxWidth - 5)
          doc.text(lines, margin + 5, yPosition)
          yPosition += lines.length * 4 + 2
        })
        yPosition += 5
      })
    },
    education: (title) => {
      sectionTitle(title)
      resume.education.forEach((item) => {
        ensureSpace(20)
        doc.setFontSize(11)
        doc.setFont('helvetica', 'bold')
        doc.text(item.course, margin, yPosition)
        yPosition += 5
        doc.setFontSize(10)
        doc.setFont('helvetica', 'normal')
        doc.text(`${item.institution} | ${item.location} | ${item.period}`, margin, yPosition)
        yPosition += 8
      })
    },
    skills: (title) => {
      sectionTitle(title)
      doc.setFontSize(10)
      doc.setFont('helvetica', 'normal')
      const lines = doc.splitTextToSize(resume.technologies.join(' • '), maxWidth)
      doc.text(lines, margin, yPosition)
      yPosition += lines.length * 4 + 8
    },
    languages: (title) => {
      sectionTitle(title)
      resume.languages.forEach((language) => {
        ensureSpace(12)
        doc.setFontSize(10)
        doc.setFont('helvetica', 'bold')
        doc.text(`${language.name}:`, margin, yPosition)
        doc.setFont('helvetica', 'normal')
        const lines = doc.splitTextToSize(language.description, maxWidth - 35)
        doc.text(lines, margin + 35, yPosition)
        yPosition += Math.max(1, lines.length) * 4 + 3
      })
    },
    projects: (title) => {
      sectionTitle(title)
      projects.slice(0, 6).forEach((project) => {
        ensureSpace(30)
        doc.setFontSize(11)
        doc.setFont('helvetica', 'bold')
        const nameLines = doc.splitTextToSize(project.title, maxWidth)
        doc.text(nameLines, margin, yPosition)
        yPosition += nameLines.length * 4 + 2
        doc.setFontSize(10)
        doc.setFont('helvetica', 'normal')
        const descriptionLines = doc.splitTextToSize(project.description, maxWidth)
        doc.text(descriptionLines, margin, yPosition)
        yPosition += descriptionLines.length * 4 + 2
        doc.setFontSize(9)
        doc.setFont('helvetica', 'italic')
        const technologyLines = doc.splitTextToSize(`${resume.projectTechnologiesLabel}: ${project.tags.join(', ')}`, maxWidth)
        doc.text(technologyLines, margin, yPosition)
        yPosition += technologyLines.length * 3 + 6
      })
    },
  }

  resume.sections.filter((section) => section.enabled).forEach((section) => {
    renderSection[section.key](section.title)
  })

  doc.save(resume.pdfFilename)
}
