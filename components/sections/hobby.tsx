'use client';

import Title from "@/components/title";
import {Separator} from "@/components/ui/separator";
import {useState, useEffect} from "react";
import {cn} from "@/lib/utils";

export function Hobby() {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        setIsVisible(true);
    }, []);

    return (
        <section className="mb-16">
            <div
                className={cn(
                    "transition-all duration-1000 ease-out delay-600",
                    isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
                )}
            >
                <Title title="Hobby" description=""/>
                <div className="space-y-4">
                    <p>
                        Nos meus momentos livres, gosto de <strong>jogar</strong> e <strong>programar</strong> em prol do meu <strong>servidor pessoal</strong>. 
                        Trabalhar no meu próprio servidor me permite experimentar novas tecnologias, testar diferentes abordagens e criar soluções personalizadas. 
                        É uma forma de continuar aprendendo e me desafiando, além de ser uma maneira divertida de aplicar meus conhecimentos em projetos reais que eu mesmo uso e desfruto.
                    </p>
                </div>
            </div>
            <Separator className="my-12"/>
        </section>
    );
}
