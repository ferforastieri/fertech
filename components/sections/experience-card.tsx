'use client';

import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card";
import {useState} from "react";
import {cn} from "@/lib/utils";

interface ExperienceCardProps {
    icon: string;
    company: string;
    period: string;
    position: string;
    description: string;
}

export function ExperienceCard({icon, company, period, position, description}: ExperienceCardProps) {
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
                <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center font-bold text-xl flex-shrink-0 transition-transform duration-300"
                         style={{
                             transform: isHovered ? 'scale(1.1)' : 'scale(1)',
                         }}
                    >
                        {icon}
                    </div>
                    <div className="flex-1">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                            <CardTitle className="text-xl">{company}</CardTitle>
                            <span className="text-sm text-muted-foreground">{period}</span>
                        </div>
                        <CardDescription className="text-base mt-1">{position}</CardDescription>
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                <p className="text-sm leading-relaxed">{description}</p>
            </CardContent>
        </Card>
    );
}
