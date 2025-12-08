import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle, Separator } from '@/components/ui/layout'
import { Badge } from '@/components/ui/feedback'
import { Button } from '@/components/ui/forms'
import { 
  BriefcaseIcon,
  AcademicCapIcon,
  MapPinIcon,
  CalendarIcon,
  ArrowDownTrayIcon,
} from '@heroicons/react/24/outline'

const technologies = [
  'JavaScript', 'TypeScript', 'PostgreSQL', 'Node', 'Express', 'React', 'NextJS',
  'Redux', 'NoSQL', 'MongoDB', 'Git', 'Java', 'Spring Boot', 'Jest',
  'Testes Unitários', 'Desenvolvimento Web', 'Desenvolvimento de APIs',
  'RESTful', 'Websockets', 'Docker', 'Frontend', 'Backend', 'Full-Stack',
]

const experiences = [
  {
    company: 'Smart S.A',
    position: 'Desenvolvedor Junior',
    location: 'Sorocaba, SP, Brasil',
    period: '06/2023 - Atual',
    responsibilities: [
      'Desenvolvimento de sistemas e aplicações internas utilizando React, Redux e Express',
      'Design e implementação de funcionalidades, realizando testes e garantindo conformidade',
      'Colaboração com equipe para melhorar desempenho e implementar melhores práticas',
    ],
  },
  {
    company: '4iNet Operadora',
    position: 'Técnico de Redes',
    location: 'Sorocaba, SP, Brasil',
    period: '01/2023 - 07/2023',
    responsibilities: [
      'Gerenciamento e configuração de redes locais e sistemas de comunicação',
      'Instalação e manutenção de equipamentos de rede',
      'Suporte técnico a clientes e equipe interna',
    ],
  },
  {
    company: 'Get Ninjas',
    position: 'Técnico em Informática',
    location: 'Brasil, SP',
    period: '01/2015 - 12/2023',
    responsibilities: [
      'Suporte técnico para equipamentos e sistemas',
      'Configuração e manutenção de redes locais',
      'Implementação de medidas de segurança',
      'Criação e manutenção de documentação técnica',
    ],
  },
]

const education = [
  {
    institution: 'Centro Universitário Facens',
    course: 'Bacharelado em Engenharia da Computação',
    location: 'Sorocaba, São Paulo',
    period: '01/2017 - 12/2022',
  },
  {
    institution: 'Universidade Paulista UNIP',
    course: 'Bacharelado em Análise e Desenvolvimento de Sistemas',
    location: 'Sorocaba, São Paulo',
    period: '01/2019 - 12/2022',
  },
]

export default function Resume() {
  const [isGenerating, setIsGenerating] = useState(false)

  const handleDownloadPDF = async () => {
    setIsGenerating(true)
    
    try {
      const { jsPDF } = await import('jspdf')
      
      const doc = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      })
      
      const pageWidth = doc.internal.pageSize.getWidth()
      const pageHeight = doc.internal.pageSize.getHeight()
      const margin = 15
      const maxWidth = pageWidth - (margin * 2)
      let yPosition = margin
      
      doc.setFontSize(20)
      doc.setFont('helvetica', 'bold')
      doc.text('FERNANDO FORASTIERI NETO', pageWidth / 2, yPosition, { align: 'center' })
      yPosition += 8
      
      doc.setFontSize(12)
      doc.setFont('helvetica', 'normal')
      doc.text('Desenvolvedor Fullstack | Frontend & UX', pageWidth / 2, yPosition, { align: 'center' })
      yPosition += 6
      
      doc.setFontSize(10)
      doc.text('LinkedIn: linkedin.com/in/fernando-forastieri | GitHub: github.com/ferforastieri', pageWidth / 2, yPosition, { align: 'center' })
      yPosition += 5
      doc.text('Twitter: @viciofer | Sorocaba, SP - Brasil', pageWidth / 2, yPosition, { align: 'center' })
      yPosition += 10
      
      doc.setFontSize(14)
      doc.setFont('helvetica', 'bold')
      doc.text('RESUMO PROFISSIONAL', margin, yPosition)
      yPosition += 6
      doc.setLineWidth(0.5)
      doc.line(margin, yPosition, pageWidth - margin, yPosition)
      yPosition += 5
      
      doc.setFontSize(10)
      doc.setFont('helvetica', 'normal')
      const aboutText = 'Desenvolvedor Fullstack especializado em frontend e experiência do usuário, com experiência no desenvolvimento de aplicações web utilizando React, TypeScript, Node.js e tecnologias modernas. Possui conhecimento em inglês técnico para escrita de código e documentações. Sempre em busca de novos desafios e mantém-se atualizado com tecnologias emergentes.'
      const aboutLines = doc.splitTextToSize(aboutText, maxWidth)
      doc.text(aboutLines, margin, yPosition)
      yPosition += (aboutLines.length * 4) + 8
      
      doc.setFontSize(14)
      doc.setFont('helvetica', 'bold')
      doc.text('EXPERIÊNCIA PROFISSIONAL', margin, yPosition)
      yPosition += 6
      doc.setLineWidth(0.5)
      doc.line(margin, yPosition, pageWidth - margin, yPosition)
      yPosition += 5
      
      experiences.forEach((exp) => {
        if (yPosition > pageHeight - 40) {
          doc.addPage()
          yPosition = margin
        }
        
        doc.setFontSize(12)
        doc.setFont('helvetica', 'bold')
        const positionLines = doc.splitTextToSize(exp.position, maxWidth - 50)
        doc.text(positionLines, margin, yPosition)
        
        doc.setFontSize(10)
        doc.setFont('helvetica', 'normal')
        doc.text(exp.period, pageWidth - margin, yPosition, { align: 'right' })
        yPosition += 6
        
        doc.setFontSize(11)
        doc.setFont('helvetica', 'italic')
        doc.text(`${exp.company} | ${exp.location}`, margin, yPosition)
        yPosition += 6
        
        doc.setFontSize(10)
        doc.setFont('helvetica', 'normal')
        exp.responsibilities.forEach((resp) => {
          if (yPosition > pageHeight - 20) {
            doc.addPage()
            yPosition = margin
          }
          const respLines = doc.splitTextToSize(`• ${resp}`, maxWidth - 5)
          doc.text(respLines, margin + 5, yPosition)
          yPosition += (respLines.length * 4) + 2
        })
        yPosition += 5
      })
      
      if (yPosition > pageHeight - 30) {
        doc.addPage()
        yPosition = margin
      }
      
      doc.setFontSize(14)
      doc.setFont('helvetica', 'bold')
      doc.text('FORMAÇÃO ACADÊMICA', margin, yPosition)
      yPosition += 6
      doc.setLineWidth(0.5)
      doc.line(margin, yPosition, pageWidth - margin, yPosition)
      yPosition += 5
      
      education.forEach((edu) => {
        if (yPosition > pageHeight - 20) {
          doc.addPage()
          yPosition = margin
        }
        
        doc.setFontSize(11)
        doc.setFont('helvetica', 'bold')
        doc.text(edu.course, margin, yPosition)
        yPosition += 5
        
        doc.setFontSize(10)
        doc.setFont('helvetica', 'normal')
        doc.text(`${edu.institution} | ${edu.location} | ${edu.period}`, margin, yPosition)
        yPosition += 8
      })
      
      if (yPosition > pageHeight - 30) {
        doc.addPage()
        yPosition = margin
      }
      
      doc.setFontSize(14)
      doc.setFont('helvetica', 'bold')
      doc.text('HABILIDADES TÉCNICAS', margin, yPosition)
      yPosition += 6
      doc.setLineWidth(0.5)
      doc.line(margin, yPosition, pageWidth - margin, yPosition)
      yPosition += 5
      
      doc.setFontSize(10)
      doc.setFont('helvetica', 'normal')
      const skillsText = technologies.join(' • ')
      const skillsLines = doc.splitTextToSize(skillsText, maxWidth)
      doc.text(skillsLines, margin, yPosition)
      yPosition += (skillsLines.length * 4) + 8
      
      if (yPosition > pageHeight - 30) {
        doc.addPage()
        yPosition = margin
      }
      
      doc.setFontSize(14)
      doc.setFont('helvetica', 'bold')
      doc.text('IDIOMAS', margin, yPosition)
      yPosition += 6
      doc.setLineWidth(0.5)
      doc.line(margin, yPosition, pageWidth - margin, yPosition)
      yPosition += 5
      
      doc.setFontSize(11)
      doc.setFont('helvetica', 'bold')
      doc.text('Português:', margin, yPosition)
      doc.setFont('helvetica', 'normal')
      doc.text('Nativo', margin + 30, yPosition)
      yPosition += 6
      
      doc.setFont('helvetica', 'bold')
      doc.text('Inglês:', margin, yPosition)
      doc.setFont('helvetica', 'normal')
      const englishText = 'Técnico - Capacidade de escrita e leitura de documentações técnicas'
      const englishLines = doc.splitTextToSize(englishText, maxWidth - 30)
      doc.text(englishLines, margin + 30, yPosition)
      yPosition += (englishLines.length * 4) + 8
      
      if (yPosition > pageHeight - 30) {
        doc.addPage()
        yPosition = margin
      }
      
      doc.setFontSize(14)
      doc.setFont('helvetica', 'bold')
      doc.text('PROJETOS RELEVANTES', margin, yPosition)
      yPosition += 6
      doc.setLineWidth(0.5)
      doc.line(margin, yPosition, pageWidth - margin, yPosition)
      yPosition += 5
      
      const selectedProjects = [
        {
          name: 'Valk UI',
          description: 'Biblioteca moderna de componentes UI para React com TypeScript. Inclui CLI interativo, suporte a dark mode, e componentes totalmente customizáveis.',
          tech: 'React, TypeScript, Tailwind CSS, CLI'
        },
        {
          name: 'Vendedor Gold - Império Cerveja',
          description: 'Sistema completo de gestão para vendedores. App mobile em React Native com TypeScript, interface web em React 18, backend NestJS com TypeORM e PostgreSQL.',
          tech: 'React Native, React 18, TypeScript, NestJS, TypeORM, PostgreSQL'
        },
        {
          name: 'Parceiro Gold - Império Cerveja',
          description: 'Plataforma para distribuidores com app mobile em React Native. Interface web em React 18 com Material-UI, backend Express e Fastify com MySQL.',
          tech: 'React Native, React 18, TypeScript, Material-UI, Express, Fastify, MySQL'
        },
        {
          name: 'LeoPlus',
          description: 'Programa de fidelidade com parcerias. Frontend React 18 com TypeScript, Material-UI, Zustand para estado e React Query para sincronização.',
          tech: 'React 18, TypeScript, Material-UI, Zustand, React Query'
        },
        {
          name: 'Clube Pro Pintor - SW',
          description: 'Sistema completo de gestão de cores e produtos. App mobile em Ionic, interface web em React 16 com Redux, backend Express com Sequelize e MySQL.',
          tech: 'Ionic, React 16, Redux, Express, Sequelize, MySQL'
        },
        {
          name: 'Experiências SW',
          description: 'Plataforma de experiências e programas de fidelidade. Interface web em React 16 com Redux para gerenciamento de estado, backend Express com Sequelize e MySQL.',
          tech: 'React 16, Redux, Express, Sequelize, MySQL'
        }
      ]
      
      selectedProjects.forEach((project) => {
        if (yPosition > pageHeight - 30) {
          doc.addPage()
          yPosition = margin
        }
        
        doc.setFontSize(11)
        doc.setFont('helvetica', 'bold')
        const projectNameLines = doc.splitTextToSize(project.name, maxWidth)
        doc.text(projectNameLines, margin, yPosition)
        yPosition += (projectNameLines.length * 4) + 2
        
        doc.setFontSize(10)
        doc.setFont('helvetica', 'normal')
        const descLines = doc.splitTextToSize(project.description, maxWidth)
        doc.text(descLines, margin, yPosition)
        yPosition += (descLines.length * 4) + 2
        
        doc.setFontSize(9)
        doc.setFont('helvetica', 'italic')
        const techLines = doc.splitTextToSize(`Tecnologias: ${project.tech}`, maxWidth)
        doc.text(techLines, margin, yPosition)
        yPosition += (techLines.length * 3) + 6
      })
      
      doc.save('CV_Fernando_Forastieri.pdf')
    } catch (error) {
      console.error('Erro ao gerar PDF:', error)
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div id="resume-content" className="max-w-4xl mx-auto space-y-12">
        {/* Header */}
        <div className="text-center">
          <div className="flex justify-center mb-6">
            <img 
              src="/logo.png" 
              alt="Logo FF" 
              className="w-24 h-24 object-contain"
            />
          </div>
          <h1 className="text-5xl font-bold mb-4 text-foreground">Fernando Forastieri Neto</h1>
          <p className="text-xl text-foreground mb-6">
            Desenvolvedor Fullstack focado em frontend e experiência do usuário
          </p>
          <Button 
            size="lg" 
            onClick={handleDownloadPDF}
            disabled={isGenerating}
            className="disabled:opacity-50"
          >
            <ArrowDownTrayIcon className="mr-2 h-5 w-5" />
            {isGenerating ? 'Gerando PDF...' : 'Baixar PDF'}
          </Button>
        </div>

        <Separator />

        {/* About */}
        <section>
          <h2 className="text-3xl font-bold mb-6 text-foreground">Sobre</h2>
          <div className="space-y-4 text-foreground">
            <p>
              Tenho experiência no desenvolvimento de aplicativos há um ano, e também experiência 
              em eletrônica e manutenção a dois anos, com o objetivo de solucionar problemas cotidianos.
            </p>
            <p>
              Também tenho experiência completa em hardware, desde a parte de manutenção, como também 
              infraestrutura, redes e etc.
            </p>
            <p>
              Estou sempre em busca de novos desafios e me mantenho atualizado, constantemente estudando 
              e explorando novas tecnologias que possam trazer benefícios. Gosto de escrever artigos, 
              tanto para meu próprio estudo quanto para auxiliar outros desenvolvedores.
            </p>
            <p>
              Tenho conhecimento de inglês técnico, o que me permite escrever código em inglês com 
              facilidade, além de ler e redigir documentações técnicas no idioma.
            </p>
          </div>
        </section>

        <Separator />

        {/* Education */}
        <section>
          <h2 className="text-3xl font-bold mb-6 flex items-center gap-2 text-foreground">
            <AcademicCapIcon className="h-8 w-8" />
            Educação
          </h2>
          <div className="space-y-6">
            {education.map((edu, index) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle className="text-xl text-foreground">{edu.course}</CardTitle>
                  <CardDescription className="text-base text-muted-foreground">{edu.institution}</CardDescription>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground mt-2">
                    <div className="flex items-center gap-1">
                      <MapPinIcon className="h-4 w-4" />
                      {edu.location}
                    </div>
                    <div className="flex items-center gap-1">
                      <CalendarIcon className="h-4 w-4" />
                      {edu.period}
                    </div>
                  </div>
                </CardHeader>
              </Card>
            ))}
          </div>
        </section>

        <Separator />

        {/* Experience */}
        <section>
          <h2 className="text-3xl font-bold mb-6 flex items-center gap-2 text-foreground">
            <BriefcaseIcon className="h-8 w-8" />
            Experiência Profissional
          </h2>
          <div className="space-y-6">
            {experiences.map((exp, index) => (
              <Card key={index}>
                <CardHeader>
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 mb-2">
                    <div>
                      <CardTitle className="text-xl text-foreground">{exp.position}</CardTitle>
                      <CardDescription className="text-base text-muted-foreground">{exp.company}</CardDescription>
                    </div>
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <CalendarIcon className="h-4 w-4" />
                      {exp.period}
                    </div>
                  </div>
                  <div className="flex items-center gap-1 text-sm text-muted-foreground mb-4">
                    <MapPinIcon className="h-4 w-4" />
                    {exp.location}
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {exp.responsibilities.map((resp, respIndex) => (
                      <li key={respIndex} className="text-sm leading-relaxed flex items-start gap-2 text-foreground">
                        <span className="mt-1.5">•</span>
                        <span>{resp}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <Separator />

        {/* Skills */}
        <section>
          <h2 className="text-3xl font-bold mb-6 text-foreground">Habilidades Técnicas</h2>
          <div className="flex flex-wrap gap-2">
            {technologies.map((tech) => (
              <Badge key={tech} variant="secondary" className="text-sm px-3 py-1">
                {tech}
              </Badge>
            ))}
          </div>
        </section>

        <Separator />

        {/* Languages */}
        <section>
          <h2 className="text-3xl font-bold mb-6 text-foreground">Idiomas</h2>
          <div className="space-y-4">
            <div>
              <p className="font-semibold text-lg text-foreground">Português</p>
              <p className="text-sm text-muted-foreground">Nativo</p>
            </div>
            <div>
              <p className="font-semibold text-lg text-foreground">Inglês</p>
              <p className="text-sm text-muted-foreground">
                Inglês técnico - Capacidade de escrita e leitura de documentações técnicas
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}
