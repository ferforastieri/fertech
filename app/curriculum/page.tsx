import siteData from "@/blog.config";
import Title from "@/components/title";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {Badge} from "@/components/ui/badge";
import {Button} from "@/components/ui/button";
import {Download, Mail, MapPin, Phone, Globe, Github, Linkedin} from "lucide-react";
import Link from "next/link";

const Curriculum = () => {
    return (
        <>
            <Title title="Currículo" description="Fernando Forastieri - Desenvolvedor Full Stack"/>
            
            <div className="max-w-4xl mx-auto space-y-8">
                {/* Header */}
                <Card className="border-2 border-blue-100">
                    <CardHeader className="text-center">
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">Fernando Forastieri</h1>
                        <p className="text-xl text-blue-600 font-semibold">Desenvolvedor Full Stack</p>
                        <div className="flex flex-wrap justify-center gap-4 mt-4 text-sm text-gray-600">
                            <div className="flex items-center gap-1">
                                <Mail className="h-4 w-4" />
                                <span>fernandoforastieri2@gmail.com</span>
                            </div>
                            <div className="flex items-center gap-1">
                                <MapPin className="h-4 w-4" />
                                <span>Sorocaba, São Paulo, Brasil</span>
                            </div>
                            <div className="flex items-center gap-1">
                                <Globe className="h-4 w-4" />
                                <span>Português (Nativo), Inglês (Técnico)</span>
                            </div>
                        </div>
                        <div className="flex justify-center gap-4 mt-4">
                            <Link href="https://github.com/ferforastieri" target="_blank">
                                <Button variant="outline" size="sm">
                                    <Github className="h-4 w-4 mr-2" />
                                    GitHub
                                </Button>
                            </Link>
                            <Link href="https://www.linkedin.com/in/fernando-forastieri" target="_blank">
                                <Button variant="outline" size="sm">
                                    <Linkedin className="h-4 w-4 mr-2" />
                                    LinkedIn
                                </Button>
                            </Link>
                            <Link href="/CVFernandoForasteri.pdf" target="_blank">
                                <Button size="sm">
                                    <Download className="h-4 w-4 mr-2" />
                                    Download PDF
                                </Button>
                            </Link>
                        </div>
                    </CardHeader>
                </Card>

                {/* Resumo */}
                <Card>
                    <CardHeader>
                        <CardTitle className="text-xl font-bold text-gray-900">Resumo Profissional</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-gray-700 leading-relaxed">
                            Desenvolvedor com experiência de um ano no desenvolvimento de aplicativos e dois anos em eletrônica e manutenção, 
                            com foco em solucionar problemas cotidianos. Possuo experiência completa em hardware, desde manutenção até 
                            infraestrutura e redes. Sempre em busca de novos desafios, mantenho-me atualizado constantemente estudando e 
                            explorando novas tecnologias. Gosto de escrever artigos tanto para meu próprio estudo quanto para auxiliar outros 
                            desenvolvedores. Possuo conhecimento de inglês técnico, permitindo escrever código em inglês com facilidade e 
                            redigir documentações técnicas no idioma.
                        </p>
                    </CardContent>
                </Card>

                {/* Habilidades Técnicas */}
                <Card>
                    <CardHeader>
                        <CardTitle className="text-xl font-bold text-gray-900">Habilidades Técnicas</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <div>
                                <h3 className="font-semibold text-gray-800 mb-2">Linguagens & Frameworks</h3>
                                <div className="flex flex-wrap gap-2">
                                    <Badge variant="secondary">JavaScript</Badge>
                                    <Badge variant="secondary">TypeScript</Badge>
                                    <Badge variant="secondary">Java</Badge>
                                    <Badge variant="secondary">Node.js</Badge>
                                    <Badge variant="secondary">Express</Badge>
                                    <Badge variant="secondary">React</Badge>
                                    <Badge variant="secondary">Next.js</Badge>
                                    <Badge variant="secondary">Redux</Badge>
                                    <Badge variant="secondary">Spring Boot</Badge>
                                </div>
                            </div>
                            <div>
                                <h3 className="font-semibold text-gray-800 mb-2">Banco de Dados & Tecnologias</h3>
                                <div className="flex flex-wrap gap-2">
                                    <Badge variant="outline">PostgreSQL</Badge>
                                    <Badge variant="outline">MongoDB</Badge>
                                    <Badge variant="outline">NoSQL</Badge>
                                    <Badge variant="outline">RESTful APIs</Badge>
                                    <Badge variant="outline">WebSockets</Badge>
                                </div>
                            </div>
                            <div>
                                <h3 className="font-semibold text-gray-800 mb-2">Ferramentas & DevOps</h3>
                                <div className="flex flex-wrap gap-2">
                                    <Badge variant="outline">Git</Badge>
                                    <Badge variant="outline">Docker</Badge>
                                    <Badge variant="outline">Jest</Badge>
                                    <Badge variant="outline">Testes Unitários</Badge>
                                </div>
                            </div>
                            <div>
                                <h3 className="font-semibold text-gray-800 mb-2">Infraestrutura & Redes</h3>
                                <div className="flex flex-wrap gap-2">
                                    <Badge variant="outline">Hardware</Badge>
                                    <Badge variant="outline">Manutenção</Badge>
                                    <Badge variant="outline">Redes</Badge>
                                    <Badge variant="outline">Infraestrutura</Badge>
                                    <Badge variant="outline">Suporte Técnico</Badge>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Experiência Profissional */}
                <Card>
                    <CardHeader>
                        <CardTitle className="text-xl font-bold text-gray-900">Experiência Profissional</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-6">
                            <div className="border-l-4 border-blue-500 pl-4">
                                <h3 className="font-semibold text-gray-900">Desenvolvedor Junior</h3>
                                <p className="text-blue-600 font-medium">Smart S.A.</p>
                                <p className="text-sm text-gray-600 mb-2">Sorocaba, SP, Brasil • 06/2023 - Atual</p>
                                <ul className="text-gray-700 space-y-1 text-sm">
                                    <li>• Participou do desenvolvimento de sistemas e aplicações internas, utilizando frameworks e tecnologias como React, Redux e Express</li>
                                    <li>• Contribui para o design e implementação de funcionalidades, realizando testes e garantindo a conformidade com os requisitos do cliente</li>
                                    <li>• Colaborei com a equipe para melhorar o desempenho do software e implementar melhores práticas de desenvolvimento</li>
                                </ul>
                            </div>

                            <div className="border-l-4 border-green-500 pl-4">
                                <h3 className="font-semibold text-gray-900">Técnico de Redes</h3>
                                <p className="text-green-600 font-medium">4iNet Operadora</p>
                                <p className="text-sm text-gray-600 mb-2">Sorocaba, SP, Brasil • 01/2023 - 07/2023</p>
                                <ul className="text-gray-700 space-y-1 text-sm">
                                    <li>• Gerenciei e configurei redes locais e sistemas de comunicação, garantindo a estabilidade e a segurança das operações</li>
                                    <li>• Realizei a instalação e manutenção de equipamentos de rede, além de resolver problemas técnicos relacionados à conectividade e desempenho</li>
                                    <li>• Suporte técnico a clientes e equipe interna para otimização de redes e resolução de incidentes</li>
                                </ul>
                            </div>

                            <div className="border-l-4 border-purple-500 pl-4">
                                <h3 className="font-semibold text-gray-900">Desenvolvedor Junior</h3>
                                <p className="text-purple-600 font-medium">NZ Softwares Pvt Limited</p>
                                <p className="text-sm text-gray-600 mb-2">Sorocaba, SP, Brasil • 01/2023 - 12/2023</p>
                                <ul className="text-gray-700 space-y-1 text-sm">
                                    <li>• Desenvolvi e mantive aplicações web e sistemas internos, trabalhando com tecnologias como JavaScript, TypeScript e Node.js</li>
                                    <li>• Colaborei com equipes multifuncionais para implementar soluções escaláveis e otimizadas, garantindo a qualidade do código e a eficiência dos sistemas</li>
                                    <li>• Realizei a integração de APIs e a implementação de novas funcionalidades conforme as necessidades dos projetos</li>
                                </ul>
                            </div>

                            <div className="border-l-4 border-orange-500 pl-4">
                                <h3 className="font-semibold text-gray-900">Técnico em Informática</h3>
                                <p className="text-orange-600 font-medium">Get Ninjas</p>
                                <p className="text-sm text-gray-600 mb-2">Brasil, SP, Brasil • 01/2015 - 12/2023</p>
                                <ul className="text-gray-700 space-y-1 text-sm">
                                    <li>• Forneci suporte técnico para equipamentos e sistemas, resolvendo problemas de hardware e software</li>
                                    <li>• Configurei e mantive redes locais, realizando tarefas de instalação e configuração de roteadores, switches e pontos de acesso</li>
                                    <li>• Implementei medidas de segurança para proteger sistemas contra ameaças cibernéticas</li>
                                    <li>• Criei e mantive documentação técnica detalhada sobre configurações de sistema e procedimentos de manutenção</li>
                                </ul>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Projetos Principais */}
                <Card>
                    <CardHeader>
                        <CardTitle className="text-xl font-bold text-gray-900">Projetos Principais</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <div className="border-l-4 border-green-500 pl-4">
                                <h3 className="font-semibold text-gray-900">Vendedor Gold - Império Cerveja</h3>
                                <p className="text-sm text-gray-600 mb-2">Sistema completo de gestão para vendedores</p>
                                <div className="flex flex-wrap gap-1 mb-2">
                                    <Badge variant="secondary" className="text-xs">React Native</Badge>
                                    <Badge variant="secondary" className="text-xs">TypeScript</Badge>
                                    <Badge variant="secondary" className="text-xs">NestJS</Badge>
                                </div>
                            </div>
                            <div className="border-l-4 border-green-500 pl-4">
                                <h3 className="font-semibold text-gray-900">Parceiro Gold - Império Cerveja</h3>
                                <p className="text-sm text-gray-600 mb-2">Plataforma mobile para distribuidores (Play Store)</p>
                                <div className="flex flex-wrap gap-1 mb-2">
                                    <Badge variant="secondary" className="text-xs">React Native</Badge>
                                    <Badge variant="secondary" className="text-xs">TypeScript</Badge>
                                    <Badge variant="secondary" className="text-xs">NestJS</Badge>
                                </div>
                            </div>
                            <div className="border-l-4 border-green-500 pl-4">
                                <h3 className="font-semibold text-gray-900">GabrielPro - Arquitetura</h3>
                                <p className="text-sm text-gray-600 mb-2">Site institucional e portfólio</p>
                                <div className="flex flex-wrap gap-1 mb-2">
                                    <Badge variant="secondary" className="text-xs">Next.js</Badge>
                                    <Badge variant="secondary" className="text-xs">TypeScript</Badge>
                                    <Badge variant="secondary" className="text-xs">Clean Architecture</Badge>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Educação */}
                <Card>
                    <CardHeader>
                        <CardTitle className="text-xl font-bold text-gray-900">Educação</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <div className="border-l-4 border-purple-500 pl-4">
                                <h3 className="font-semibold text-gray-900">Bacharelado em Engenharia da Computação</h3>
                                <p className="text-purple-600 font-medium">Centro Universitário Facens</p>
                                <p className="text-sm text-gray-600">Sorocaba, São Paulo • 01/2017 - 12/2020</p>
                            </div>
                            <div className="border-l-4 border-purple-500 pl-4">
                                <h3 className="font-semibold text-gray-900">Bacharelado em Análise e Desenvolvimento de Sistemas</h3>
                                <p className="text-purple-600 font-medium">Universidade Paulista UNIP</p>
                                <p className="text-sm text-gray-600">Sorocaba, São Paulo • 01/2019 - 12/2022</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Certificações & Cursos */}
                <Card>
                    <CardHeader>
                        <CardTitle className="text-xl font-bold text-gray-900">Certificações & Cursos</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-2">
                            <div className="flex items-center gap-2">
                                <Badge variant="outline" className="text-xs">Inglês Técnico</Badge>
                                <span className="text-sm text-gray-700">Capacidade de escrita e documentação técnica</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Badge variant="outline" className="text-xs">Learn in Public</Badge>
                                <span className="text-sm text-gray-700">Contribuição ativa na comunidade tech</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Badge variant="outline" className="text-xs">Open Source</Badge>
                                <span className="text-sm text-gray-700">Participação em projetos open source</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Badge variant="outline" className="text-xs">Hardware & Redes</Badge>
                                <span className="text-sm text-gray-700">Experiência em manutenção e infraestrutura</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </>
    )
}

export default Curriculum
