import {Hero} from "@/components/sections/hero";
import {About} from "@/components/sections/about";
import {Hobby} from "@/components/sections/hobby";
import {BugBounty} from "@/components/sections/bug-bounty";
import {Experience} from "@/components/sections/experience";
import {Courses} from "@/components/sections/courses";
import {Skills} from "@/components/sections/skills";
import {BlogSection} from "@/components/sections/blog-section";
import {Contact} from "@/components/sections/contact";

export default function Home() {
    return (
        <>
            <Hero />
            <About />
            <Hobby />
            <BugBounty />
            <Experience />
            <Courses />
            <Skills />
            <BlogSection />
            <Contact />
        </>
    );
}
