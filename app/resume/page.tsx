import Title from "@/components/title";
import {Button} from "@/components/ui/button";
import Link from "next/link";

export default function Resume() {
    return (
        <>
            <Title title="Currículo" description="Download do meu currículo em PDF"/>
            <div className="space-y-6">
                <p className="text-muted-foreground">
                    Você pode baixar meu currículo completo em formato PDF clicando no botão abaixo.
                </p>
                <Link href="/CVFernandoForasteri.pdf" target="_blank" rel="noopener noreferrer">
                    <Button 
                        variant="outline" 
                        size="lg"
                        className="transition-all duration-300 ease-out hover:scale-105"
                    >
                        Baixar Currículo (PDF)
                    </Button>
                </Link>
            </div>
        </>
    );
}
