import Title from "@/components/title";
import {Separator} from "@/components/ui/separator";
import {Button} from "@/components/ui/button";
import Link from "next/link";

export function BlogSection() {
    return (
        <section className="mb-16">
            <Title title="Artigos e Opinões" description="Publicações em meu blog pessoal"/>
            <div className="space-y-4">
                <p className="text-muted-foreground">
                    Eu gosto de escrever uma variedade de coisas, desde reflexões pessoais até conteúdo técnico profissional. 
                    Você pode encontrar alguns exemplos abaixo.
                </p>
                <Link href="/blog">
                    <Button variant="outline">Ver todos os artigos</Button>
                </Link>
            </div>
            <Separator className="my-12"/>
        </section>
    );
}

