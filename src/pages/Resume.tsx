import { Card, CardContent, CardDescription, CardHeader, CardTitle, Separator } from '@/components/layout'
import { Badge } from '@/components/feedback'
import { Button } from '@/components/forms'
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
    period: '01/2017 - 12/2020',
  },
  {
    institution: 'Universidade Paulista UNIP',
    course: 'Bacharelado em Análise e Desenvolvimento de Sistemas',
    location: 'Sorocaba, São Paulo',
    period: '01/2019 - 12/2022',
  },
]

export default function Resume() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto space-y-12">
        {/* Header */}
        <div className="text-center">
          <div className="flex justify-center mb-6">
            <img 
              src="/logo.png" 
              alt="Logo FF" 
              className="w-24 h-24 object-contain"
            />
          </div>
          <h1 className="text-5xl font-bold mb-4 text-black dark:text-white">Fernando Forastieri Neto</h1>
          <p className="text-xl text-black dark:text-white mb-6">
            Desenvolvedor Fullstack focado em frontend e experiência do usuário
          </p>
          <a href="/CVFernandoForasteri.pdf" target="_blank" rel="noopener noreferrer">
            <Button size="lg" className="bg-black dark:bg-white text-white dark:text-black border-2 border-black dark:border-white hover:bg-white dark:hover:bg-black hover:text-black dark:hover:text-white">
              <ArrowDownTrayIcon className="mr-2 h-5 w-5" />
              Baixar PDF
            </Button>
          </a>
        </div>

        <Separator className="bg-black dark:bg-white" />

        {/* About */}
        <section>
          <h2 className="text-3xl font-bold mb-6 text-black dark:text-white">Sobre</h2>
          <div className="space-y-4 text-black dark:text-white">
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

        <Separator className="bg-black dark:bg-white" />

        {/* Education */}
        <section>
          <h2 className="text-3xl font-bold mb-6 flex items-center gap-2 text-black dark:text-white">
            <AcademicCapIcon className="h-8 w-8" />
            Educação
          </h2>
          <div className="space-y-6">
            {education.map((edu, index) => (
              <Card key={index} className="border-2 border-black dark:border-white bg-white dark:bg-black">
                <CardHeader>
                  <CardTitle className="text-xl text-black dark:text-white">{edu.course}</CardTitle>
                  <CardDescription className="text-base text-black dark:text-white">{edu.institution}</CardDescription>
                  <div className="flex items-center gap-4 text-sm text-black dark:text-white mt-2">
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

        <Separator className="bg-black dark:bg-white" />

        {/* Experience */}
        <section>
          <h2 className="text-3xl font-bold mb-6 flex items-center gap-2 text-black dark:text-white">
            <BriefcaseIcon className="h-8 w-8" />
            Experiência Profissional
          </h2>
          <div className="space-y-6">
            {experiences.map((exp, index) => (
              <Card key={index} className="border-2 border-black dark:border-white bg-white dark:bg-black">
                <CardHeader>
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 mb-2">
                    <div>
                      <CardTitle className="text-xl text-black dark:text-white">{exp.position}</CardTitle>
                      <CardDescription className="text-base text-black dark:text-white">{exp.company}</CardDescription>
                    </div>
                    <div className="flex items-center gap-1 text-sm text-black dark:text-white">
                      <CalendarIcon className="h-4 w-4" />
                      {exp.period}
                    </div>
                  </div>
                  <div className="flex items-center gap-1 text-sm text-black dark:text-white mb-4">
                    <MapPinIcon className="h-4 w-4" />
                    {exp.location}
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {exp.responsibilities.map((resp, respIndex) => (
                      <li key={respIndex} className="text-sm leading-relaxed flex items-start gap-2 text-black dark:text-white">
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

        <Separator className="bg-black dark:bg-white" />

        {/* Skills */}
        <section>
          <h2 className="text-3xl font-bold mb-6 text-black dark:text-white">Habilidades Técnicas</h2>
          <div className="flex flex-wrap gap-2">
            {technologies.map((tech) => (
              <Badge key={tech} variant="secondary" className="text-sm px-3 py-1 border border-black dark:border-white bg-white dark:bg-black text-black dark:text-white">
                {tech}
              </Badge>
            ))}
          </div>
        </section>

        <Separator className="bg-black dark:bg-white" />

        {/* Languages */}
        <section>
          <h2 className="text-3xl font-bold mb-6 text-black dark:text-white">Idiomas</h2>
          <div className="space-y-4">
            <div>
              <p className="font-semibold text-lg text-black dark:text-white">Português</p>
              <p className="text-sm text-black dark:text-white">Nativo</p>
            </div>
            <div>
              <p className="font-semibold text-lg text-black dark:text-white">Inglês</p>
              <p className="text-sm text-black dark:text-white">
                Inglês técnico - Capacidade de escrita e leitura de documentações técnicas
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}
