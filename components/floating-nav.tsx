'use client';

import Link from "next/link";
import {usePathname} from "next/navigation";
import {Button} from "@/components/ui/button";
import {Moon, Sun, Home, BookOpen, FolderKanban, FileText, Github, Linkedin, Mail} from "lucide-react";
import {XIcon} from "@/components/icons/x-icon";
import {useTheme} from "next-themes";
import {useState, useEffect} from "react";
import {cn} from "@/lib/utils";

const routes = [
    {
        name: "Início",
        value: "/",
        icon: Home,
    },
    {
        name: "Artigos",
        value: "/blog",
        icon: BookOpen,
    },
    {
        name: "Projetos",
        value: "/projects",
        icon: FolderKanban,
    },
    {
        name: "Currículo",
        value: "/resume",
        icon: FileText,
    },
];

const socialLinks = [
    {
        name: "Github",
        url: "https://github.com/ferforastieri",
        icon: Github,
    },
    {
        name: "LinkedIn",
        url: "https://www.linkedin.com/in/fernando-forastieri",
        icon: Linkedin,
    },
    {
        name: "X",
        url: "https://x.com/viciofer",
        icon: XIcon,
    },
    {
        name: "Email",
        url: "mailto:fernandoforastieri2@gmail.com",
        icon: Mail,
    },
];

export default function FloatingNav() {
    const pathname = usePathname();
    const {theme, setTheme} = useTheme();
    const [mounted, setMounted] = useState(false);
    const [isBarHovered, setIsBarHovered] = useState(false);
    const [hoveredIcon, setHoveredIcon] = useState<string | null>(null);

    useEffect(() => {
        setMounted(true);
    }, []);

    const active = pathname === '/' ? '/' : '/' + pathname.split('/')[1];

    return (
        <nav className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-50 w-[calc(100%-2rem)] sm:w-auto max-w-[calc(100vw-2rem)] sm:max-w-none">
            <div 
                className={cn(
                    "flex items-center bg-background/80 backdrop-blur-md border border-border rounded-full shadow-lg transition-all duration-700 ease-[cubic-bezier(0.34,1.56,0.64,1)]",
                    "px-2 sm:px-3 py-2 gap-1 sm:gap-2",
                    isBarHovered && "sm:gap-3"
                )}
                onMouseEnter={() => setIsBarHovered(true)}
                onMouseLeave={() => {
                    setIsBarHovered(false);
                    setHoveredIcon(null);
                }}
            >
                {routes.map((route, routeIndex) => {
                    const Icon = route.icon;
                    const isActive = active === route.value;
                    const iconKey = `route-${route.value}`;
                    const isThisIconHovered = hoveredIcon === iconKey;
                    
                    // Movimento sutil: esquerda vai esquerda, direita vai direita
                    const translateX = isBarHovered && !hoveredIcon
                        ? (routeIndex === 0 ? -4 : 4)
                        : isThisIconHovered
                            ? (routeIndex === 0 ? -6 : 6)
                            : 0;
                    const scale = isThisIconHovered ? 1.15 : (isBarHovered && !hoveredIcon ? 1.03 : 1);
                    
                    return (
                        <Link 
                            key={route.value} 
                            href={route.value}
                            onMouseEnter={() => setHoveredIcon(iconKey)}
                            onMouseLeave={() => setHoveredIcon(null)}
                        >
                            <Button
                                variant={isActive ? "secondary" : "ghost"}
                                size="icon"
                                className={cn(
                                    "rounded-full transition-all duration-300 ease-out hover:bg-primary/10 h-8 w-8 sm:h-10 sm:w-10 flex-shrink-0",
                                    isActive && "bg-primary text-primary-foreground"
                                )}
                                style={{
                                    transform: `translateX(${translateX}px) scale(${scale})`,
                                }}
                                title={route.name}
                            >
                                <Icon className="h-4 w-4 sm:h-5 sm:w-5" />
                            </Button>
                        </Link>
                    );
                })}
                <div className="h-4 sm:h-6 w-px bg-border mx-0.5 sm:mx-1 flex-shrink-0" />
                {socialLinks.map((social) => {
                    const SocialIcon = social.icon;
                    const iconKey = `social-${social.name}`;
                    const isThisIconHovered = hoveredIcon === iconKey;
                    
                    const translateX = isBarHovered && !hoveredIcon ? 4 : (isThisIconHovered ? 6 : 0);
                    const scale = isThisIconHovered ? 1.15 : (isBarHovered && !hoveredIcon ? 1.03 : 1);
                    
                    return (
                        <Link
                            key={social.name}
                            href={social.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            onMouseEnter={() => setHoveredIcon(iconKey)}
                            onMouseLeave={() => setHoveredIcon(null)}
                        >
                            <Button
                                size="icon"
                                variant="ghost"
                                className="rounded-full transition-all duration-300 ease-out hover:bg-primary/10 h-8 w-8 sm:h-10 sm:w-10 flex-shrink-0"
                                style={{
                                    transform: `translateX(${translateX}px) scale(${scale})`,
                                }}
                                title={social.name}
                            >
                                <SocialIcon className="h-4 w-4 sm:h-5 sm:w-5" />
                            </Button>
                        </Link>
                    );
                })}
                <div className="h-4 sm:h-6 w-px bg-border mx-0.5 sm:mx-1 flex-shrink-0" />
                {mounted && (
                    <Button
                        size="icon"
                        variant="ghost"
                        className="rounded-full transition-all duration-300 ease-out hover:bg-primary/10 h-8 w-8 sm:h-10 sm:w-10 flex-shrink-0"
                        style={{
                            transform: hoveredIcon === 'theme' 
                                ? 'translateX(6px) scale(1.15)' 
                                : isBarHovered && !hoveredIcon
                                    ? 'translateX(4px) scale(1.03)' 
                                    : 'translateX(0) scale(1)',
                        }}
                        onMouseEnter={() => setHoveredIcon('theme')}
                        onMouseLeave={() => setHoveredIcon(null)}
                        onClick={() => {
                            setTheme(theme === 'light' ? 'dark' : 'light');
                        }}
                        title={theme === 'light' ? 'Modo escuro' : 'Modo claro'}
                    >
                        {theme === 'light' ? (
                            <Moon className="h-4 w-4 sm:h-5 sm:w-5" />
                        ) : (
                            <Sun className="h-4 w-4 sm:h-5 sm:w-5" />
                        )}
                    </Button>
                )}
            </div>
        </nav>
    );
}
