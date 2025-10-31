'use client';

import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card";
import {useState} from "react";
import {cn} from "@/lib/utils";

interface CertificationCardProps {
    icon: string;
    company: string;
    name: string;
    hours: string;
}

export function CertificationCard({icon, company, name, hours}: CertificationCardProps) {
    const [isHovered, setIsHovered] = useState(false);
    
    const translateX = isHovered ? 4 : 0;
    const scale = isHovered ? 1.02 : 1;

    return (
        <Card 
            className="transition-all duration-300 ease-out cursor-pointer hover:border-primary/50"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            style={{
                transform: `translateX(${translateX}px) scale(${scale})`,
            }}
        >
            <CardHeader>
                <div className="flex items-center gap-3">
                    <div 
                        className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center font-bold transition-transform duration-300"
                        style={{
                            transform: isHovered ? 'scale(1.1)' : 'scale(1)',
                        }}
                    >
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
