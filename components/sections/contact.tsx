import Title from "@/components/title";
import {Button} from "@/components/ui/button";
import Link from "next/link";
import {Twitter} from "lucide-react";

export function Contact() {
    return (
        <section className="mb-16">
            <Title title="Contato" description="Entre em contato!"/>
            <div className="space-y-4">
                <p>
                    Quer conversar? Me envie uma dm no twitter e eu responderei assim que puder.
                </p>
                <Link href="https://twitter.com" target="_blank">
                    <Button>
                        <Twitter className="mr-2 h-4 w-4"/>
                        Twitter
                    </Button>
                </Link>
            </div>
        </section>
    );
}

