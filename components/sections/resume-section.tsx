'use client';

import Title from "@/components/title";
import {Separator} from "@/components/ui/separator";
import {Badge} from "@/components/ui/badge";
import {Button} from "@/components/ui/button";
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card";
import {Mail, MapPin, Calendar, GraduationCap, Briefcase, Languages, Download} from "lucide-react";
import Link from "next/link";
import {useState, useEffect} from "react";
import {cn} from "@/lib/utils";

const technologies = [
    "JavaScript",
    "TypeScript",
    "PostgreSQL",
    "Node",
    "Express",
    "React",
    "NextJS",
    "Redux",
    "NoSQL",
    "MongoDB",
    "Git",
    "Java",
    "Spring Boot",
    "Jest",
    "Testes Unitários",
    "Desenvolvimento Web",
    "Desenvolvimento de APIs",
    "RESTful",
    "Websockets",
    "Docker",
    "Frontend",
    "Backend",
    "Full-Stack"
];

const experiences = [
    {
        company: "Smart S.A",
        position: "Desenvolvedor Junior",
        location: "Sorocaba, SP, Brasil",
        period: "06/2023 - Atual",
        responsibilities: [
            "Participou do desenvolvimento de sistemas e aplicações internas, utilizando frameworks e tecnologias como React, Redux e Express.",
            "Contribui para o design e implementação de funcionalidades, realizando testes e garantindo a conformidade com os requisitos do cliente.",
            "Colaborei com a equipe para melhorar o desempenho do software e implementar melhores práticas de desenvolvimento."
        ]
    },
    {
        company: "4iNet Operadora",
        position: "Técnico de Redes",
        location: "Sorocaba, SP, Brasil",
        period: "01/2023 - 07/2023",
        responsibilities: [
            "Gerenciei e configurei redes locais e sistemas de comunicação, garantindo a estabilidade e a segurança das operações.",
            "Realizei a instalação e manutenção de equipamentos de rede, além de resolver problemas técnicos relacionados à conectividade e desempenho.",
            "Suporte técnico a clientes e equipe interna para otimização de redes e resolução de incidentes."
        ]
    },
    {
        company: "Get Ninjas",
        position: "Técnico em Informática",
        location: "Brasil, SP",
        period: "01/2015 - 12/2023",
        responsibilities: [
            "Forneci suporte técnico para equipamentos e sistemas, resolvendo problemas de hardware e software, e garantindo a operação contínua e eficiente dos sistemas.",
            "Configurei e mantive redes locais, realizando tarefas de instalação e configuração de roteadores, switches e pontos de acesso.",
            "Implementei medidas de segurança para proteger sistemas contra ameaças cibernéticas, incluindo atualizações de software e gerenciamento de firewalls.",
            "Criei e mantive documentação técnica detalhada sobre configurações de sistema, procedimentos de manutenção e soluções para problemas recorrentes."
        ]
    }
];

const education = [
    {
        institution: "Centro Universitário Facens",
        course: "Bacharelado em Engenharia da Computação",
        location: "Sorocaba, São Paulo",
        period: "01/2017 - 12/2020"
    },
    {
        institution: "Universidade Paulista UNIP",
        course: "Bacharelado em Análise e Desenvolvimento de Sistemas",
        location: "Sorocaba, São Paulo",
        period: "01/2019 - 12/2022"
    }
];

export function ResumeSection() {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        setIsVisible(false);
        const timer = setTimeout(() => {
            setIsVisible(true);
        }, 50);
        return () => clearTimeout(timer);
    }, []);

    return (
        <div className="mb-16 space-y-12">
            {/* Cabeçalho com Informações Pessoais */}
            <section
                className={cn(
                    "transition-all duration-1000 ease-out",
                    isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
                )}
            >
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
                    <div>
                        <h1 className="!text-4xl md:!text-5xl font-bold mb-2">Fernando Forastieri Neto</h1>
                        <p className="text-xl text-muted-foreground mb-4">
                            Desenvolvedor Fullstack focado em frontend e experiência do usuário
                        </p>
                        <div className="flex flex-wrap gap-4 text-sm">
                            <div className="flex items-center gap-2">
                                <Mail className="h-4 w-4 text-muted-foreground" />
                                <Link href="mailto:fernandoforastieri2@gmail.com" className="hover:underline">
                                    fernandoforastieri2@gmail.com
                                </Link>
                            </div>
                            <div className="flex items-center gap-2">
                                <MapPin className="h-4 w-4 text-muted-foreground" />
                                <span className="text-muted-foreground">Brasil</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Link href="https://x.com/viciofer" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:underline">
                                    <span className="text-muted-foreground">X (Twitter)</span>
                                </Link>
                            </div>
                        </div>
                    </div>
                    <Link href="/CVFernandoForasteri.pdf" target="_blank" rel="noopener noreferrer">
                        <Button 
                            variant="outline" 
                            size="lg"
                            className="transition-all duration-300 ease-out hover:scale-105"
                        >
                            <Download className="mr-2 h-4 w-4"/>
                            Baixar PDF
                        </Button>
                    </Link>
                </div>
            </section>

            <Separator />

            {/* Sobre */}
            <section
                className={cn(
                    "transition-all duration-1000 ease-out delay-200",
                    isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
                )}
            >
                <Title title="Sobre" />
                <div className="space-y-4">
                    <p>
                        Tenho experiência no desenvolvimento de aplicativos há um ano, e também experiência em eletrônica e manutenção a dois anos, 
                        com o objetivo de solucionar problemas cotidianos.
                    </p>
                    <p>
                        Também tenho experiência completa em hardware, desde a parte de manutenção, como também infraestrutura, redes e etc.
                    </p>
                    <p>
                        Estou sempre em busca de novos desafios e me mantenho atualizado, constantemente estudando e explorando novas tecnologias que 
                        possam trazer benefícios. Gosto de escrever artigos, tanto para meu próprio estudo quanto para auxiliar outros desenvolvedores.
                    </p>
                    <p>
                        Tenho conhecimento de inglês técnico, o que me permite escrever código em inglês com facilidade, além de ler e redigir documentações 
                        técnicas no idioma.
                    </p>
                </div>
            </section>

            <Separator />

            {/* Educação */}
            <section
                className={cn(
                    "transition-all duration-1000 ease-out delay-300",
                    isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
                )}
            >
                <Title title="Educação" />
                <div className="space-y-6">
                    {education.map((edu, index) => (
                        <Card
                            key={index}
                            className={cn(
                                "transition-all duration-500 ease-out hover:border-primary/50",
                                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
                            )}
                            style={{
                                transitionDelay: `${500 + index * 100}ms`
                            }}
                        >
                            <CardHeader>
                                <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                                        <GraduationCap className="h-6 w-6 text-primary" />
                                    </div>
                                    <div className="flex-1">
                                        <CardTitle className="text-xl">{edu.course}</CardTitle>
                                        <CardDescription className="text-base">{edu.institution}</CardDescription>
                                        <div className="flex items-center gap-2 text-sm text-muted-foreground mt-2">
                                            <MapPin className="h-4 w-4" />
                                            {edu.location}
                                        </div>
                                        <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                                            <Calendar className="h-4 w-4" />
                                            {edu.period}
                                        </div>
                                    </div>
                                </div>
                            </CardHeader>
                        </Card>
                    ))}
                </div>
            </section>

            <Separator />

            {/* Experiência Profissional */}
            <section
                className={cn(
                    "transition-all duration-1000 ease-out delay-400",
                    isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
                )}
            >
                <Title title="Experiência Profissional" />
                <div className="space-y-6">
                    {experiences.map((exp, index) => (
                        <Card
                            key={index}
                            className={cn(
                                "transition-all duration-500 ease-out hover:border-primary/50",
                                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
                            )}
                            style={{
                                transitionDelay: `${600 + index * 100}ms`
                            }}
                        >
                            <CardHeader>
                                <div className="flex flex-col gap-2">
                                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                                        <div>
                                            <CardTitle className="text-xl">{exp.position}</CardTitle>
                                            <CardDescription className="text-base">{exp.company}</CardDescription>
                                        </div>
                                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                            <Calendar className="h-4 w-4" />
                                            {exp.period}
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                        <MapPin className="h-4 w-4" />
                                        {exp.location}
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <ul className="space-y-2">
                                    {exp.responsibilities.map((resp, respIndex) => (
                                        <li key={respIndex} className="text-sm leading-relaxed flex items-start gap-2">
                                            <span className="text-primary mt-1.5">•</span>
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

            {/* Habilidades Técnicas */}
            <section
                className={cn(
                    "transition-all duration-1000 ease-out delay-500",
                    isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
                )}
            >
                <Title title="Habilidades Técnicas" />
                <div className="space-y-6">
                    <div className="flex flex-wrap gap-2">
                        {technologies.map((tech, index) => (
                            <Badge
                                key={tech}
                                variant="secondary"
                                className={cn(
                                    "text-sm px-3 py-1 transition-all duration-500 ease-out hover:scale-110 hover:translate-y-[-2px] cursor-default hover:shadow-lg",
                                    isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
                                )}
                                style={{
                                    transitionDelay: `${700 + index * 50}ms`
                                }}
                            >
                                {tech}
                            </Badge>
                        ))}
                    </div>
                </div>
            </section>

            <Separator />

            {/* Idiomas */}
            <section
                className={cn(
                    "transition-all duration-1000 ease-out delay-600",
                    isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
                )}
            >
                <Title title="Idiomas" />
                <div className="space-y-4">
                    <div className="flex items-center gap-4">
                        <Languages className="h-5 w-5 text-primary" />
                        <div>
                            <p className="font-semibold">Português</p>
                            <p className="text-sm text-muted-foreground">Nativo</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <Languages className="h-5 w-5 text-primary" />
                        <div>
                            <p className="font-semibold">Inglês</p>
                            <p className="text-sm text-muted-foreground">Inglês técnico - Capacidade de escrita e leitura de documentações técnicas</p>
                        </div>
                    </div>
                </div>
            </section>

            <Separator />

            {/* Botão de Download */}
            <section
                className={cn(
                    "transition-all duration-1000 ease-out delay-1000",
                    isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
                )}
            >
                <div className="flex justify-center">
                    <Link href="/CVFernandoForasteri.pdf" target="_blank" rel="noopener noreferrer">
                        <Button 
                            size="lg"
                            className="transition-all duration-300 ease-out hover:scale-105"
                        >
                            <Download className="mr-2 h-5 w-5"/>
                            Baixar Currículo Completo (PDF)
                        </Button>
                    </Link>
                </div>
            </section>
        </div>
    );
}

