'use client';

import Title from "@/components/title";
import {Button} from "@/components/ui/button";
import Link from "next/link";
import {XIcon} from "@/components/icons/x-icon";
import {useState, useEffect} from "react";
import {cn} from "@/lib/utils";

export function Contact() {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        // Reset para garantir animação a cada carregamento
        setIsVisible(false);
        const timer = setTimeout(() => {
            setIsVisible(true);
        }, 50);
        return () => clearTimeout(timer);
    }, []);

    return (
        <section className="mb-16">
            <div
                className={cn(
                    "transition-all duration-1000 ease-out delay-1000",
                    isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
                )}
            >
                <Title title="Contato" />
                <div className="space-y-4">
                    <p>
                        Quer conversar? Me envie uma dm no twitter e eu responderei assim que puder.
                    </p>
                    <Link href="https://x.com/viciofer" target="_blank" rel="noopener noreferrer">
                        <Button className="transition-all duration-300 ease-out hover:scale-105">
                            <XIcon className="mr-2 h-4 w-4"/>
                            Twitter
                        </Button>
                    </Link>
                </div>
            </div>
        </section>
    );
}
