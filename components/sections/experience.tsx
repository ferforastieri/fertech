import Title from "@/components/title";
import {Separator} from "@/components/ui/separator";
import {ExperienceCard} from "./experience-card";

const experiences = [
    {
        icon: "M",
        company: "Mercado livre",
        period: "Maio 2024 - Atual",
        position: "Application Security Engineer",
        description: "Colaboro para manter o ambiente seguro por meio da realização de pentests em aplicações Web, Mobile e APIs, com abordagem gray-box e white-box. Atuo na modelagem de ameaças para novas funcionalidades e fluxos críticos de transações e custódia de criptoativos. Também realizo análises SAST voltadas à identificação proativa de vulnerabilidades e participo da gestão de vulnerabilidades ao longo de todo o ciclo de vida do produto, em colaboração com times de desenvolvimento distribuídos internacionalmente."
    },
    {
        icon: "P",
        company: "PagBank",
        period: "Outubro 2023 - Maio 2024",
        position: "Application Security Engineer",
        description: "Atuei garantindo a segurança de aplicações embarcadas e de suporte à operação dos terminais de cartão de crédito/débito, conduzindo pentests Web, Mobile, APIs e Hardware, com abordagem gray-box e black-box. Realizei modelagem de ameaças voltada à prevenção de fraudes físicas e digitais, além de SAST em aplicações. Também participei da gestão de vulnerabilidades, priorizando riscos com base em impacto técnico e regulatório."
    },
    {
        icon: "V",
        company: "Via",
        period: "Março 2022 - Outubro 2023",
        position: "Offensive Security Engineer",
        description: "Realizei pentests em aplicações Web, APIs e Mobile, com abordagem gray-box e black-box, voltados à identificação de vulnerabilidades em produtos de e-commerce e marketplace de larga escala. Colaborei com equipes internas de segurança e auditoria em projetos estratégicos e iniciativas de PCI-DSS."
    },
];

export function Experience() {
    return (
        <section className="mb-16">
            <Title title="Experiências Profissionais" description=""/>
            <div className="space-y-6">
                {experiences.map((exp, index) => (
                    <ExperienceCard key={index} {...exp} />
                ))}
            </div>
            <Separator className="my-12"/>
        </section>
    );
}

