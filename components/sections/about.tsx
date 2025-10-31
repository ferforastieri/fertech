import Title from "@/components/title";
import {Separator} from "@/components/ui/separator";

export function About() {
    return (
        <section className="mb-16">
            <Title title="Sobre mim" description=""/>
            <div className="space-y-4">
                <p>
                    Iniciei minha jornada na tecnologia aos 11 anos com Game Hacking, o que despertou meu interesse por programação. 
                    Em 2022, entrei na área de Cybersecurity como profissional de <strong>Offensive Security</strong>. 
                    Quase 2 anos depois, passei a atuar na área de <strong>Application Security</strong> no PagBank, 
                    colaborando na segurança de terminais POS (maquininhas de cartão de crédito). 
                    Atualmente, trabalho no Mercado Livre com foco em <strong>Product Security</strong> envolvendo Criptomoedas, 
                    colaborando com times internacionais, onde utilizo diariamente os idiomas português e espanhol.
                </p>
            </div>
            <Separator className="my-12"/>
        </section>
    );
}

