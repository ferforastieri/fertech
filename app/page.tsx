import {Hero} from "@/components/sections/hero";
import {Contact} from "@/components/sections/contact";
import {Separator} from "@/components/ui/separator";

export default function Home() {
    return (
        <>
            <Hero />
            <Separator className="my-12" />
            <Contact />
        </>
    );
}
