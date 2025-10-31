import Title from "@/components/title";
import {Separator} from "@/components/ui/separator";
import {BugBountyCard} from "./bug-bounty-card";

const bugBountyData = [
    {
        icon: "A",
        company: "Apple",
        title: "Apple",
        description: "Encontrei vulnerabilidades de segurança em sistemas da Apple e tive meu nome mencionado no Hall da Fama de pesquisadores de segurança cibernética.",
        link: "https://developer.apple.com/support/security/",
        instructions: [
            'Clique no botão "Confira" para abrir o site da Apple',
            'Busque pela edição "April 2025"',
            'Em ordem alfabética, identifique o nome "Fernando Forastieri Neto"'
        ]
    },
    {
        icon: "M",
        company: "Microsoft",
        title: "Microsoft",
        description: "Encontrei vulnerabilidades de segurança em sistemas da Microsoft e tive meu nome mencionado no Hall da Fama de pesquisadores de segurança cibernética.",
        link: "https://msrc.microsoft.com/update-guide/acknowledgments",
        instructions: [
            'Clique no botão "Confira" para abrir o site da Microsoft',
            'Em "Selecionar intervalo de datas" configure "De: Jan 1, 2025" e mantenha a secção "Para:" de forma padrão.',
            'Em "Palavra-chave" busque pelo nome "Fernando Forastieri Neto"'
        ]
    },
    {
        icon: "U",
        company: "Uber",
        title: "Uber",
        description: "Durante minha jornada como pesquisador, encontrei vulnerabilidades na Uber.",
        link: "https://hackerone.com",
        instructions: [
            'Clique no botão "Confira"',
            'No perfil da HackerOne, clique em em "View more"'
        ]
    },
    {
        icon: "P",
        company: "Paypal",
        title: "Paypal",
        description: "Durante minha jornada como pesquisador, encontrei vulnerabilidades no Paypal.",
        link: "https://hackerone.com",
        instructions: [
            'Clique no botão "Confira"',
            'No perfil da HackerOne, clique em em "View more"'
        ]
    },
    {
        icon: "A",
        company: "Atlassian",
        title: "Atlassian",
        description: "Durante minha jornada como pesquisador, encontrei vulnerabilidades na Atlassian.",
        link: "https://bugcrowd.com",
        instructions: [
            'Clique no botão "Confira"',
            'No perfil da Bugcrowd, localize as recompensas na aba CrowdStream'
        ]
    },
    {
        icon: "B",
        company: "Booking.com",
        title: "Booking.com",
        description: "Durante minha jornada como pesquisador, encontrei vulnerabilidades na Booking.",
        link: "https://hackerone.com",
        instructions: [
            'Clique no botão "Confira"',
            'No perfil da HackerOne, clique em em "View more"'
        ]
    },
    {
        icon: "S",
        company: "Snapchat",
        title: "Snapchat",
        description: "Durante minha jornada como pesquisador, encontrei vulnerabilidades no Snapchat.",
        link: "https://hackerone.com",
        instructions: [
            'Clique no botão "Confira"',
            'No perfil da HackerOne, clique em em "View more"'
        ]
    },
    {
        icon: "C",
        company: "Coinbase",
        title: "Coinbase",
        description: "Durante minha jornada como pesquisador, encontrei vulnerabilidades na Coinbase.",
        link: "https://hackerone.com",
        instructions: [
            'Clique no botão "Confira"',
            'No perfil da HackerOne, clique em em "View more"'
        ]
    },
    {
        icon: "H",
        company: "HackerOne",
        title: "HackerOne",
        description: "Durante minha jornada como pesquisador, encontrei vulnerabilidades na HackerOne.",
        link: "https://hackerone.com",
        instructions: [
            'Clique no botão "Confira"',
            'No perfil da HackerOne, clique em em "View more"'
        ]
    },
];

export function BugBounty() {
    return (
        <section className="mb-16">
            <h2 className="text-2xl font-bold mb-8">Conquistas em Bug Bounty</h2>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {bugBountyData.map((item, index) => (
                    <BugBountyCard key={index} {...item} />
                ))}
            </div>
            <Separator className="my-12"/>
        </section>
    );
}

