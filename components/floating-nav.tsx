'use client';

import Link from "next/link";
import {usePathname} from "next/navigation";
import {Button} from "@/components/ui/button";
import {Moon, Sun, Home, BookOpen, FolderKanban, FileText, Github, Linkedin, Mail, LayoutGrid} from "lucide-react";
import {XIcon} from "@/components/icons/x-icon";
import {useTheme} from "next-themes";
import {useState, useEffect} from "react";
import {cn} from "@/lib/utils";

type NavPosition = 'bottom-center' | 'right' | 'center-top' | 'left';

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
    const [position, setPosition] = useState<NavPosition>('bottom-center');
    const [isAnimating, setIsAnimating] = useState(false);

    useEffect(() => {
        setMounted(true);
        // Carregar posição salva do localStorage
        const savedPosition = localStorage.getItem('floating-nav-position') as NavPosition;
        if (savedPosition && ['bottom-center', 'right', 'center-top', 'left'].includes(savedPosition)) {
            // No mobile, só permitir bottom-center ou center-top
            const isMobile = window.innerWidth < 640;
            if (isMobile && (savedPosition === 'right' || savedPosition === 'left')) {
                setPosition('bottom-center');
                localStorage.setItem('floating-nav-position', 'bottom-center');
            } else {
                setPosition(savedPosition);
            }
        }
    }, []);

    const cyclePosition = () => {
        setIsAnimating(true);
        const isMobile = window.innerWidth < 640;
        const positions: NavPosition[] = isMobile 
            ? ['bottom-center', 'center-top']
            : ['bottom-center', 'right', 'center-top', 'left'];
        const currentIndex = positions.indexOf(position);
        const nextIndex = (currentIndex + 1) % positions.length;
        const nextPosition = positions[nextIndex];
        
        setPosition(nextPosition);
        localStorage.setItem('floating-nav-position', nextPosition);
        
        setTimeout(() => setIsAnimating(false), 700);
    };

    const active = pathname === '/' ? '/' : '/' + pathname.split('/')[1];

    const getNavPositionClasses = () => {
        switch (position) {
            case 'right':
                return 'fixed bottom-1/2 right-4 transform translate-y-1/2 flex-col';
            case 'center-top':
                return 'fixed top-4 left-1/2 transform -translate-x-1/2';
            case 'left':
                return 'fixed bottom-1/2 left-4 transform translate-y-1/2 flex-col';
            default: // bottom-center
                return 'fixed bottom-4 left-1/2 transform -translate-x-1/2';
        }
    };

    return (
        <nav className={cn(
            "z-50 w-[calc(100%-2rem)] sm:w-auto max-w-[calc(100vw-2rem)] sm:max-w-none transition-all duration-700",
            getNavPositionClasses()
        )}>
            <div 
                className={cn(
                    "flex items-center bg-background/80 backdrop-blur-md border border-border rounded-full shadow-lg transition-all duration-700 ease-[cubic-bezier(0.34,1.56,0.64,1)]",
                    "px-1 sm:px-3 py-1.5 sm:py-2 gap-0.5 sm:gap-2",
                    isBarHovered && "sm:gap-3",
                    (position === 'right' || position === 'left') && "flex-col"
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
                    const translateX = isAnimating
                        ? 0
                        : isBarHovered && !hoveredIcon
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
                                    isActive && "bg-primary text-primary-foreground",
                                    isAnimating && "animate-bubble"
                                )}
                                style={!isAnimating ? {
                                    transform: `translateX(${translateX}px) scale(${scale})`,
                                } : undefined}
                                title={route.name}
                            >
                                <Icon className="h-4 w-4 sm:h-5 sm:w-5" />
                            </Button>
                        </Link>
                    );
                })}
                <div className="h-3 sm:h-6 w-px bg-border mx-0 sm:mx-1 flex-shrink-0" />
                {socialLinks.map((social) => {
                    const SocialIcon = social.icon;
                    const iconKey = `social-${social.name}`;
                    const isThisIconHovered = hoveredIcon === iconKey;
                    
                    const translateX = isAnimating
                        ? 0
                        : isBarHovered && !hoveredIcon ? 4 : (isThisIconHovered ? 6 : 0);
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
                                className={cn(
                                    "rounded-full transition-all duration-300 ease-out hover:bg-primary/10 h-8 w-8 sm:h-10 sm:w-10 flex-shrink-0",
                                    isAnimating && "animate-bubble"
                                )}
                                style={!isAnimating ? {
                                    transform: `translateX(${translateX}px) scale(${scale})`,
                                } : undefined}
                                title={social.name}
                            >
                                <SocialIcon className="h-4 w-4 sm:h-5 sm:w-5" />
                            </Button>
                        </Link>
                    );
                })}
                <div className="h-3 sm:h-6 w-px bg-border mx-0 sm:mx-1 flex-shrink-0" />
                <Button
                    size="icon"
                    variant="ghost"
                    className={cn(
                        "rounded-full transition-all duration-300 ease-out hover:bg-primary/10 h-8 w-8 sm:h-10 sm:w-10 flex-shrink-0",
                        isAnimating && "animate-bubble"
                    )}
                    style={!isAnimating ? {
                        transform: hoveredIcon === 'position' 
                            ? 'translateX(6px) scale(1.15)' 
                            : isBarHovered && !hoveredIcon
                                ? 'translateX(4px) scale(1.03)' 
                                : 'translateX(0) scale(1)',
                    } : undefined}
                    onMouseEnter={() => setHoveredIcon('position')}
                    onMouseLeave={() => setHoveredIcon(null)}
                    onClick={cyclePosition}
                    title="Alterar posição"
                >
                    <LayoutGrid className="h-4 w-4 sm:h-5 sm:w-5" />
                </Button>
                <div className="h-3 sm:h-6 w-px bg-border mx-0 sm:mx-1 flex-shrink-0" />
                {mounted && (
                    <Button
                        size="icon"
                        variant="ghost"
                        className={cn(
                            "rounded-full transition-all duration-300 ease-out hover:bg-primary/10 h-8 w-8 sm:h-10 sm:w-10 flex-shrink-0",
                            isAnimating && "animate-bubble"
                        )}
                        style={!isAnimating ? {
                            transform: hoveredIcon === 'theme' 
                                ? 'translateX(6px) scale(1.15)' 
                                : isBarHovered && !hoveredIcon
                                    ? 'translateX(4px) scale(1.03)' 
                                    : 'translateX(0) scale(1)',
                        } : undefined}
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
