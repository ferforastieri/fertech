'use client';

import Title from "@/components/title";
import {Separator} from "@/components/ui/separator";
import {useState, useEffect} from "react";
import {cn} from "@/lib/utils";

export function About() {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        setIsVisible(true);
    }, []);

    return (
        <section className="mb-16">
            <div
                className={cn(
                    "transition-all duration-1000 ease-out delay-400",
                    isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
                )}
            >
                <Title title="Sobre mim" description=""/>
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
            </div>
            <Separator className="my-12"/>
        </section>
    );
}
