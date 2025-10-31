import Title from "@/components/title";
import {Separator} from "@/components/ui/separator";
import {Badge} from "@/components/ui/badge";

const skills = [
    "Application Security",
    "Pentest WEB/API",
    "Pentest Mobile (Android & iOS)",
    "Threat Modelling",
    "SAST",
    "Code-Review",
    "Open Source Intelligence",
    "Bug Bounty",
    "Security Research",
    "Kotlin",
    "Java",
    "Python",
    "Javascript",
];

export function Skills() {
    return (
        <section className="mb-16">
            <Title title="Skills" description=""/>
            <div className="flex flex-wrap gap-2">
                {skills.map((skill, index) => (
                    <Badge key={index} variant="secondary">{skill}</Badge>
                ))}
            </div>
            <Separator className="my-12"/>
        </section>
    );
}

