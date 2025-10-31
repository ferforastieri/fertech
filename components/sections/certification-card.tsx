import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card";

interface CertificationCardProps {
    icon: string;
    company: string;
    name: string;
    hours: string;
}

export function CertificationCard({icon, company, name, hours}: CertificationCardProps) {
    return (
        <Card>
            <CardHeader>
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center font-bold">
                        {icon}
                    </div>
                    <div>
                        <CardTitle className="text-lg">{name}</CardTitle>
                        <CardDescription>{company}</CardDescription>
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                <p className="text-sm text-muted-foreground">{hours}</p>
            </CardContent>
        </Card>
    );
}

