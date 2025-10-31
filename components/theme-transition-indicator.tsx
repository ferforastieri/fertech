'use client';

import {useTheme} from "next-themes";
import {Lightbulb} from "lucide-react";
import {useState, useEffect, useRef} from "react";
import {cn} from "@/lib/utils";

export function ThemeTransitionIndicator() {
    const {resolvedTheme, theme} = useTheme();
    const [isTransitioning, setIsTransitioning] = useState(false);
    const [animatingTo, setAnimatingTo] = useState<'dark' | 'light' | null>(null);
    const prevThemeRef = useRef<string | undefined>();
    const mountedRef = useRef(false);

    useEffect(() => {
        // Marca como montado após o primeiro render
        if (!mountedRef.current) {
            mountedRef.current = true;
            prevThemeRef.current = resolvedTheme;
            return;
        }

        // Detecta mudança de tema apenas se já estiver montado e o tema realmente mudou
        if (prevThemeRef.current && prevThemeRef.current !== resolvedTheme && resolvedTheme) {
            setIsTransitioning(true);
            // Determina para qual tema está animando (o tema atual após a mudança)
            setAnimatingTo(resolvedTheme as 'dark' | 'light');
            
            // Atualiza a referência imediatamente para permitir novas detecções
            prevThemeRef.current = resolvedTheme;
            
            const timer = setTimeout(() => {
                setIsTransitioning(false);
                setAnimatingTo(null);
            }, 800);
            
            return () => clearTimeout(timer);
        }
    }, [resolvedTheme, theme]);

    if (!isTransitioning || !animatingTo || !mountedRef.current) return null;

    return (
        <div className={cn(
            "fixed z-50 pointer-events-none",
            "top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-fade-in-up",
            "md:top-6 md:left-6 md:translate-x-0 md:translate-y-0 md:animate-none"
        )}>
            <div className={cn(
                "relative flex items-center justify-center",
                "w-16 h-16 md:w-12 md:h-12",
                "rounded-full",
                "bg-background/90 backdrop-blur-sm",
                "border border-border shadow-lg",
                "transition-all duration-300"
            )}>
                <Lightbulb className={cn(
                    "h-6 w-6 md:h-5 md:w-5 relative z-10",
                    "transition-all duration-300",
                    animatingTo === 'dark' 
                        ? "animate-lightbulb-on text-yellow-400 drop-shadow-[0_0_8px_rgba(250,204,21,0.8)]" 
                        : "animate-lightbulb-off"
                )} />
                {/* Efeito de brilho quando acesa */}
                {animatingTo === 'dark' && (
                    <div className="absolute inset-0 rounded-full bg-yellow-400/20 animate-pulse" />
                )}
                {/* Efeito de sombra quando apaga */}
                {animatingTo === 'light' && (
                    <div className="absolute inset-0 rounded-full bg-yellow-400/30 animate-pulse" />
                )}
            </div>
        </div>
    );
}

