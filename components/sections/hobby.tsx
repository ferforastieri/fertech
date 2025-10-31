import Title from "@/components/title";
import {Separator} from "@/components/ui/separator";

export function Hobby() {
    return (
        <section className="mb-16">
            <Title title="Hobby" description=""/>
            <div className="space-y-4">
                <p>
                    Dedico parte do meu tempo livre ao bug bounty. Sou responsável por identificar e reportar vulnerabilidades 
                    para empresas gigantes dos setores de tecnologia, viagens e finanças — ajudando a tornar a internet mais 
                    segura para milhões de usuários em sistemas que, muito provavelmente, você também utiliza.
                </p>
            </div>
            <Separator className="my-12"/>
        </section>
    );
}

