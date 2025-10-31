'use client';

import {useEffect, useState} from "react";
import {cn} from "@/lib/utils";

export function ArticleContent({content, articleTitle}: {content: string; articleTitle?: string}) {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        setIsVisible(false);
        const timer = setTimeout(() => {
            setIsVisible(true);
        }, 50);
        return () => clearTimeout(timer);
    }, [content]);

    // Processar markdown básico
    const processContent = (text: string) => {
        const lines = text.split('\n');
        const elements: JSX.Element[] = [];
        let inCodeBlock = false;
        let codeBlockContent: string[] = [];
        let codeLanguage = '';
        let firstH1Skipped = false;

        lines.forEach((line, index) => {
            // Code blocks
            if (line.startsWith('```')) {
                if (inCodeBlock) {
                    // Fechar code block
                    elements.push(
                        <pre key={`code-${index}`} className="bg-muted p-4 rounded-lg overflow-x-auto my-4">
                            <code>{codeBlockContent.join('\n')}</code>
                        </pre>
                    );
                    codeBlockContent = [];
                    inCodeBlock = false;
                    return;
                } else {
                    // Abrir code block
                    codeLanguage = line.replace('```', '').trim();
                    inCodeBlock = true;
                    return;
                }
            }

            if (inCodeBlock) {
                codeBlockContent.push(line);
                return;
            }

            // Headings
            if (line.startsWith('# ')) {
                // Pular o primeiro h1 se for igual ao título do artigo
                if (!firstH1Skipped && articleTitle && line.replace('# ', '').trim() === articleTitle.trim()) {
                    firstH1Skipped = true;
                    return;
                }
                elements.push(
                    <h1 key={index} className="text-3xl font-bold mt-8 mb-4">
                        {line.replace('# ', '')}
                    </h1>
                );
                return;
            }
            if (line.startsWith('## ')) {
                elements.push(
                    <h2 key={index} className="text-2xl font-bold mt-6 mb-3">
                        {line.replace('## ', '')}
                    </h2>
                );
                return;
            }
            if (line.startsWith('### ')) {
                elements.push(
                    <h3 key={index} className="text-xl font-semibold mt-4 mb-2">
                        {line.replace('### ', '')}
                    </h3>
                );
                return;
            }

            // Bold
            let processedLine = line;
            processedLine = processedLine.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');

            // Inline code
            processedLine = processedLine.replace(/`(.*?)`/g, '<code class="bg-muted px-1.5 py-0.5 rounded text-sm font-mono">$1</code>');

            // Empty lines
            if (line.trim() === '') {
                elements.push(<br key={`br-${index}`}/>);
                return;
            }

            // Regular paragraphs
            elements.push(
                <p
                    key={index}
                    className="mb-4 leading-relaxed"
                    dangerouslySetInnerHTML={{__html: processedLine}}
                />
            );
        });

        return elements;
    };

    return (
        <div
            className={cn(
                "prose prose-lg dark:prose-invert max-w-none transition-all duration-1000 ease-out",
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            )}
        >
            {processContent(content)}
        </div>
    );
}

