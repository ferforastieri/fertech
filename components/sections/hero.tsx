'use client';

import Title from "@/components/title";
import {Separator} from "@/components/ui/separator";
import {Badge} from "@/components/ui/badge";
import {useState, useEffect} from "react";
import {cn} from "@/lib/utils";

export function Hero() {
    const technologies = [
        "React",
        "Next Js",
        "TypeScript",
        "JavaScript",
        "Tailwind CSS",
        "Node Js (NestJs)",
        "Testes Unitários em Jest",
        "Docker",
        "AWS EC2",
        "Infraestrutura",
        "DevOps",
        "Serverless",
        "Rest API"
    ];

    const [isVisible, setIsVisible] = useState(false);
    const [badgesVisible, setBadgesVisible] = useState(false);

    useEffect(() => {
        // Reset para garantir animação a cada carregamento
        setIsVisible(false);
        setBadgesVisible(false);
        
        // Pequeno delay para garantir que o reset foi aplicado
        const resetTimer = setTimeout(() => {
            setIsVisible(true);
        }, 50);
        
        const badgeTimer = setTimeout(() => {
            setBadgesVisible(true);
        }, 650);
        
        return () => {
            clearTimeout(resetTimer);
            clearTimeout(badgeTimer);
        };
    }, []);

    return (
        <div className="mb-16">
            <section 
                className={cn(
                    "mb-12 transition-all duration-1000 ease-out",
                    isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
                )}
            >
                <div className="mb-4">
                    <div className="flex items-start gap-4 mb-1">
                        <h1 className="!text-4xl md:!text-5xl lg:!text-6xl font-bold leading-tight m-0 pt-1">Fernando Forastieri Neto</h1>
                        <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center font-bold text-lg flex-shrink-0 mt-3 ml-2">
                            FFN
                        </div>
                    </div>
                    <p className="text-lg text-muted-foreground">
                        Desenvolvedor Fullstack focado em frontend e experiência do usuário, que ama explorar tecnologias e criar soluções inovadoras.
                    </p>
                </div>
            </section>

            <Separator className="my-12" />

            <section 
                className={cn(
                    "mb-12 transition-all duration-1000 ease-out delay-300",
                    isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
                )}
            >
                <Title title="Quem sou eu?" description="" />
                <div className="space-y-4">
                    <p>
                        Primeiramente, sempre tive o pensamento de nunca dividir o profissional do pessoal, a vida é só uma. 
                        Se eu trabalho com você, você é meu amigo, e se você é meu amigo, isso é o suficiente. 
                        Isso obviamente me rendeu olhares estranhos, mas sempre a mesma reação final: <strong>"É muito fácil trabalhar com você"</strong>
                    </p>
                    <p>
                        E é isso que prezo, um ambiente leve e descontraído antes de qualquer meta, task ou habilidade. 
                        Mas, obviamente, qualquer coisa que envolve tecnologia me move. Se você quiser me conhecer melhor tecnicamente, leia abaixo.
                    </p>
                </div>
            </section>

            <Separator className="my-12" />

            <section 
                className={cn(
                    "mb-12 transition-all duration-1000 ease-out delay-500",
                    isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
                )}
            >
                <Title title="Sobre mim" description="" />
                <div className="space-y-4">
                    <p>
                        Sou desenvolvedor com foco em <strong>frontend</strong> e <strong>experiência do usuário</strong>, sempre buscando criar interfaces que sejam não apenas funcionais, mas também intuitivas e agradáveis. 
                        Acredito que a tecnologia deve servir para melhorar a vida das pessoas, e por isso me dedico a desenvolver soluções que sejam ao mesmo tempo poderosas e fáceis de usar.
                    </p>
                    <p>
                        Além do desenvolvimento, tenho uma grande <strong>paixão por games</strong>. Os jogos sempre foram parte importante da minha vida e foram o que me despertaram o interesse inicial pela programação. 
                        Essa paixão me ajudou a desenvolver habilidades de resolução de problemas, pensamento estratégico e trabalho em equipe, que aplico constantemente no meu trabalho como desenvolvedor.
                    </p>
                </div>
            </section>

            <Separator className="my-12" />

            <section 
                className={cn(
                    "mb-12 transition-all duration-1000 ease-out delay-700",
                    isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
                )}
            >
                <Title title="Hobby" description="" />
                <div className="space-y-4">
                    <p>
                        Nos meus momentos livres, gosto de <strong>jogar</strong> e <strong>programar</strong> em prol do meu <strong>servidor pessoal</strong>. 
                        Trabalhar no meu próprio servidor me permite experimentar novas tecnologias, testar diferentes abordagens e criar soluções personalizadas. 
                        É uma forma de continuar aprendendo e me desafiando, além de ser uma maneira divertida de aplicar meus conhecimentos em projetos reais que eu mesmo uso e desfruto.
                    </p>
                </div>
            </section>

            <Separator className="my-12" />

            <section 
                className={cn(
                    "mb-12 transition-all duration-1000 ease-out delay-900",
                    isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
                )}
            >
                <Title title="E minhas capacidades técnicas?" description="" />
                <div className="space-y-6">
                    <p>
                        Desenvolvedor fullstack com foco em <strong>experiência do usuário (UX)</strong> e <strong>frontend</strong>, especializado em NodeJs, Javascript, Typescript e React para desenvolvimento e manutenção de softwares para plataformas web. 
                        Com experiência em plataformas SaaS como um ERP de ponta a ponta, e criação de landing pages, sites estáticos, promocionais e demais.
                    </p>
                    <div className="flex flex-wrap gap-2">
                        {technologies.map((tech, index) => (
                            <Badge 
                                key={tech} 
                                variant="secondary" 
                                className={cn(
                                    "text-sm px-3 py-1 transition-all duration-700 ease-out hover:scale-115 hover:translate-y-[-3px] cursor-default hover:shadow-lg",
                                    badgesVisible 
                                        ? "opacity-100 translate-y-0" 
                                        : "opacity-0 translate-y-8"
                                )}
                                style={{
                                    transitionDelay: `${1200 + index * 100}ms`
                                }}
                            >
                                {tech}
                            </Badge>
                        ))}
                    </div>
                    <p className="text-sm text-muted-foreground italic">
                        Possuo inglês avançado com capacidade de escrita e fala.
                    </p>
                </div>
            </section>
        </div>
    );
}
