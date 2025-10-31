'use client';

import Title from "@/components/title";
import {ExpandableSection} from "@/components/ui/expandable-section";
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card";
import {Badge} from "@/components/ui/badge";
import Link from "next/link";
import {useState, useEffect} from "react";
import {cn} from "@/lib/utils";
import {workArticles, personalArticles} from "@/data/articles";

export function BlogArticlesSection() {
    const [isVisible, setIsVisible] = useState(false);
    const [hoveredCard, setHoveredCard] = useState<string | null>(null);

    useEffect(() => {
        setIsVisible(false);
        const timer = setTimeout(() => {
            setIsVisible(true);
        }, 50);
        return () => clearTimeout(timer);
    }, []);

    return (
        <div className="mb-16 space-y-8">
            <section
                className={cn(
                    "transition-all duration-1000 ease-out",
                    isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
                )}
            >
                <Title title="Artigos" />
                <p className={cn(
                    "text-muted-foreground mb-4 transition-all duration-1000 ease-out",
                    isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
                )} style={{transitionDelay: "100ms"}}>
                    Artigos sobre desenvolvimento, tecnologia e reflexões pessoais.
                </p>

                <div className="w-full space-y-3">
                    <ExpandableSection
                        title="Artigos de Trabalho"
                        badge={
                            <Badge variant="secondary" className="ml-2 transition-all duration-300">
                                {workArticles.length} artigos
                            </Badge>
                        }
                        className={cn(
                            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
                        )}
                        style={{transitionDelay: "200ms"}}
                    >
                        <div className="space-y-4">
                            {workArticles.map((article, index) => (
                                <Link 
                                    key={article.slug} 
                                    href={`/blog/${article.slug}`}
                                    onMouseEnter={() => setHoveredCard(article.slug)}
                                    onMouseLeave={() => setHoveredCard(null)}
                                >
                                    <Card
                                        className={cn(
                                            "transition-all duration-300 ease-out cursor-pointer",
                                            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4",
                                            hoveredCard === article.slug 
                                                ? "border-primary/50 shadow-lg scale-[1.02] translate-x-1" 
                                                : "hover:border-primary/50 hover:shadow-md"
                                        )}
                                    >
                                        <CardHeader className="p-4">
                                            <div className="flex items-start justify-between gap-4 mb-2">
                                                <CardTitle className={cn(
                                                    "text-lg leading-tight transition-all duration-300",
                                                    hoveredCard === article.slug && "text-primary"
                                                )}>
                                                    {article.title}
                                                </CardTitle>
                                                <Badge 
                                                    variant="outline" 
                                                    className={cn(
                                                        "flex-shrink-0 transition-all duration-300",
                                                        hoveredCard === article.slug && "scale-110"
                                                    )}
                                                >
                                                    {article.category}
                                                </Badge>
                                            </div>
                                            <CardDescription className="text-sm">
                                                {article.description}
                                            </CardDescription>
                                        </CardHeader>
                                        <CardContent>
                                            <div className="flex items-center gap-4 text-xs text-muted-foreground">
                                                <span className={cn(
                                                    "transition-all duration-300",
                                                    hoveredCard === article.slug && "text-foreground"
                                                )}>
                                                    {article.date}
                                                </span>
                                                <span>•</span>
                                                <span className={cn(
                                                    "transition-all duration-300",
                                                    hoveredCard === article.slug && "text-foreground"
                                                )}>
                                                    {article.readTime} de leitura
                                                </span>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </Link>
                            ))}
                        </div>
                    </ExpandableSection>

                    <ExpandableSection
                        title="Artigos Pessoais"
                        badge={
                            <Badge variant="secondary" className="ml-2 transition-all duration-300">
                                {personalArticles.length} artigos
                            </Badge>
                        }
                        className={cn(
                            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
                        )}
                        style={{transitionDelay: "300ms"}}
                    >
                        <div className="space-y-4">
                            {personalArticles.map((article, index) => (
                                <Link 
                                    key={article.slug} 
                                    href={`/blog/${article.slug}`}
                                    onMouseEnter={() => setHoveredCard(article.slug)}
                                    onMouseLeave={() => setHoveredCard(null)}
                                >
                                    <Card
                                        className={cn(
                                            "transition-all duration-300 ease-out cursor-pointer",
                                            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4",
                                            hoveredCard === article.slug 
                                                ? "border-primary/50 shadow-lg scale-[1.02] translate-x-1" 
                                                : "hover:border-primary/50 hover:shadow-md"
                                        )}
                                    >
                                        <CardHeader className="p-4">
                                            <div className="flex items-start justify-between gap-4 mb-2">
                                                <CardTitle className={cn(
                                                    "text-lg leading-tight transition-all duration-300",
                                                    hoveredCard === article.slug && "text-primary"
                                                )}>
                                                    {article.title}
                                                </CardTitle>
                                                <Badge 
                                                    variant="outline" 
                                                    className={cn(
                                                        "flex-shrink-0 transition-all duration-300",
                                                        hoveredCard === article.slug && "scale-110"
                                                    )}
                                                >
                                                    {article.category}
                                                </Badge>
                                            </div>
                                            <CardDescription className="text-sm">
                                                {article.description}
                                            </CardDescription>
                                        </CardHeader>
                                        <CardContent>
                                            <div className="flex items-center gap-4 text-xs text-muted-foreground">
                                                <span className={cn(
                                                    "transition-all duration-300",
                                                    hoveredCard === article.slug && "text-foreground"
                                                )}>
                                                    {article.date}
                                                </span>
                                                <span>•</span>
                                                <span className={cn(
                                                    "transition-all duration-300",
                                                    hoveredCard === article.slug && "text-foreground"
                                                )}>
                                                    {article.readTime} de leitura
                                                </span>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </Link>
                            ))}
                        </div>
                    </ExpandableSection>
                </div>
            </section>
        </div>
    );
}
