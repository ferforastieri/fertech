import Title from "@/components/title";
import {Separator} from "@/components/ui/separator";
import {Badge} from "@/components/ui/badge";

export function Hero() {
    const technologies = [
        "Node Js (NestJs)",
        "TypeScript",
        "Testes Unitários em Jest",
        "React",
        "Next Js",
        "Docker",
        "AWS EC2",
        "Rest API"
    ];

    return (
        <div className="mb-16">
            <h1 className="text-5xl font-bold mb-6">Bem vindo ao FerTech</h1>
            
            <section className="mb-12">
                <Title title="Introdução" description="" />
                <p className="text-lg text-muted-foreground">
                    Aqui irei compartilhar minha vida, não apenas trabalho, mas tudo que envolve minha pessoa e minha jornada.
                </p>
            </section>

            <Separator className="my-12" />

            <section className="mb-12">
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

            <section className="mb-12">
                <Title title="E minhas capacidades técnicas?" description="" />
                <div className="space-y-6">
                    <p>
                        Desenvolvedor fullstack com foco em NodeJs, Javascript, Typescript e React para desenvolvimento e manutenção de softwares para plataformas web. 
                        Com experiência em plataformas SaaS como um ERP de ponta a ponta, e criação de landing pages, sites estáticos, promocionais e demais.
                    </p>
                    <div className="flex flex-wrap gap-2">
                        {technologies.map((tech) => (
                            <Badge key={tech} variant="secondary" className="text-sm px-3 py-1">
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
