import Title from "@/components/title";
import {Separator} from "@/components/ui/separator";
import {ProjectCard} from "./project-card";

const projects = [
    {
        title: "Vendedor Gold - Império Cerveja",
        description: "Sistema completo de gestão para vendedores da Império Cerveja. Desenvolvido em React Native com TypeScript, backend robusto em NestJS e interface web em React. Inclui controle de vendas, gestão de clientes, relatórios em tempo real e integração com sistemas ERP.",
        url: "https://vendedorgold.com.br",
        logo: "/sellergold-logo-DDxGLlDM.png"
    },
    {
        title: "Parceiro Gold - Império Cerveja",
        description: "Plataforma mobile para distribuidores da Império Cerveja, disponível na Play Store. Desenvolvido com React Native, TypeScript e NestJS. Sistema de gestão de distribuição, controle de estoque, rastreamento de entregas e dashboard analítico para parceiros.",
        url: "https://parceirogold.com.br",
        logo: "/pglogosite-3bf9bf64.png"
    },
    {
        title: "GabrielPro - Arquitetura",
        description: "Site institucional e portfólio para empresa de arquitetura. Desenvolvido em Next.js com TypeScript, implementando Clean Architecture e Use Cases. Design responsivo, otimizado para SEO, galeria de projetos e sistema de contato integrado.",
        url: "https://gabrielpro.com.br",
        logo: "/logo-gabrielpro.png"
    },
    {
        title: "Ecossistema Sherwin Williams",
        description: "Sistema completo de gestão de cores e produtos para Sherwin Williams. Aplicativo mobile em Ionic, backend em JavaScript e versão web responsiva. Inclui catálogo de cores, calculadora de tintas, gestão de pedidos e integração com estoque.",
        url: "https://clubepropintor.com.br",
        logo: "/logo-dark.png"
    },
    {
        title: "E-Sports",
        description: "Minha Carreira Completa nos E-sports:",
        url: "#",
        logo: "/logo.png"
    }
];

export function Projects() {
    return (
        <section className="mb-16">
            <Title title="O que eu tenho feito e contribuido" description="Um resumo de todos os projetos e de participações ativas na comunidade Tech ao longo dos anos"/>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {projects.map((project, index) => (
                    <ProjectCard key={index} {...project} />
                ))}
            </div>
            <Separator className="my-12"/>
        </section>
    );
}
