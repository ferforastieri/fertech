import {notFound} from "next/navigation";
import {allArticles} from "@/data/articles";
import {ArticleContent} from "@/components/sections/article-content";
import {Separator} from "@/components/ui/separator";
import {Badge} from "@/components/ui/badge";
import {ArrowLeft} from "lucide-react";
import Link from "next/link";
import {Button} from "@/components/ui/button";

export async function generateStaticParams() {
    return allArticles.map((article) => ({
        slug: article.slug,
    }));
}

export default function ArticlePage({params}: {params: {slug: string}}) {
    const article = allArticles.find((a) => a.slug === params.slug);

    if (!article) {
        notFound();
    }

    return (
        <div className="mb-16">
            <Link href="/blog">
                <Button variant="ghost" className="mb-6 transition-all duration-300 ease-out hover:scale-105">
                    <ArrowLeft className="mr-2 h-4 w-4"/>
                    Voltar para Artigos
                </Button>
            </Link>
            
            <article>
                <header className="mb-8">
                    <div className="flex items-center gap-3 mb-4">
                        <Badge variant="outline">{article.category}</Badge>
                        <span className="text-sm text-muted-foreground">{article.readTime} de leitura</span>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold mb-4">{article.title}</h1>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span>{article.date}</span>
                    </div>
                </header>

                <Separator className="my-8"/>

                <ArticleContent content={article.content} articleTitle={article.title} />
            </article>
        </div>
    );
}

