'use client';

import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card";
import Link from "next/link";
import {useState} from "react";
import {cn} from "@/lib/utils";
import Image from "next/image";

interface ProjectCardProps {
    title: string;
    description: string;
    url?: string;
    logo?: string;
}

export function ProjectCard({title, description, url, logo}: ProjectCardProps) {
    const [isHovered, setIsHovered] = useState(false);
    
    const translateX = isHovered ? 4 : 0;
    const scale = isHovered ? 1.05 : 1;

    return (
        <Link 
            href={url || "#"} 
            target={url && url !== "#" ? "_blank" : undefined}
            rel={url && url !== "#" ? "noopener noreferrer" : undefined}
            className="block h-full"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <Card 
                className={cn(
                    "transition-all duration-300 ease-out cursor-pointer hover:border-primary/50 h-full flex flex-col",
                    !url || url === "#" ? "cursor-default" : ""
                )}
                style={{
                    transform: `translateX(${translateX}px) scale(${scale})`,
                }}
            >
                <CardHeader className="pb-2 pt-4">
                    <div className="flex items-center gap-3">
                        {logo && (
                            <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center flex-shrink-0 overflow-hidden">
                                <Image 
                                    src={logo} 
                                    alt={title}
                                    width={40}
                                    height={40}
                                    className="object-contain p-1"
                                />
                            </div>
                        )}
                        <CardTitle className="text-base line-clamp-2 flex-1">{title}</CardTitle>
                    </div>
                </CardHeader>
                <CardContent className="pt-0 pb-4">
                    <CardDescription className="text-sm leading-relaxed">
                        {description}
                    </CardDescription>
                </CardContent>
            </Card>
        </Link>
    );
}
