import Title from "@/components/title";
import {Separator} from "@/components/ui/separator";
import {CertificationCard} from "./certification-card";

const certifications = [
    {
        icon: "D",
        company: "Desec Security",
        name: "Desec Certified Penetration Tester [DCPT]",
        hours: "200 horas de aulas + CERT"
    },
    {
        icon: "G",
        company: "GoHacking",
        name: "Ethical Hacking Active Directory Operations",
        hours: "40 horas"
    },
    {
        icon: "C",
        company: "Crowsec / HackingClub",
        name: "WEB HACKING 3.0",
        hours: "65 horas"
    },
    {
        icon: "S",
        company: "Sec4US",
        name: "Web API Exploitation",
        hours: "40 horas"
    },
];

export function Courses() {
    return (
        <section className="mb-16">
            <Title title="Cursos e certificações" description=""/>
            <div className="grid gap-4 md:grid-cols-2">
                {certifications.map((cert, index) => (
                    <CertificationCard key={index} {...cert} />
                ))}
            </div>
            <Separator className="my-12"/>
        </section>
    );
}

