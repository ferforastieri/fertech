import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {Button} from "@/components/ui/button";
import Link from "next/link";

interface BugBountyCardProps {
    icon: string;
    company: string;
    title: string;
    description: string;
    link: string;
    instructions: string[];
}

export function BugBountyCard({icon, company, title, description, link, instructions}: BugBountyCardProps) {
    return (
        <Card>
            <CardHeader>
                <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center font-bold text-xl">
                        {icon}
                    </div>
                    <CardTitle className="text-xl">{title}</CardTitle>
                </div>
            </CardHeader>
            <CardContent>
                <p className="text-sm text-muted-foreground mb-4">{description}</p>
                <div className="text-xs text-muted-foreground mb-4 space-y-1">
                    <p className="font-semibold">Você pode verificar este feito através das instruções abaixo:</p>
                    <ol className="list-decimal list-inside space-y-1 ml-2">
                        {instructions.map((instruction, index) => (
                            <li key={index}>{instruction}</li>
                        ))}
                    </ol>
                </div>
                <Link href={link} target="_blank">
                    <Button variant="outline" className="w-full">Confira</Button>
                </Link>
            </CardContent>
        </Card>
    );
}

