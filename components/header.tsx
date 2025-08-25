'use client';

import siteData from "@/blog.config";
import Link from "next/link";
import {usePathname} from "next/navigation";
import {Button} from "@/components/ui/button";
import {
    Sheet,
    SheetContent,
    SheetTrigger
} from "@/components/ui/sheet";
import Image from "next/image";
import {useState} from "react";
import {Separator} from "@/components/ui/separator";
import {Github, Menu, Moon, Sun} from "lucide-react";
import {useTheme} from "next-themes";

const Header = () => {
    const {githubRepo, header: {logo, title, routes}} = siteData

    //高亮导航栏
    const pathname = usePathname()
    const active = routes.find((item: any) => item.value == '/' + pathname.split('/')[1])?.name

    const {theme, setTheme} = useTheme()
    const [open, setOpen] = useState(false)

    const handleCurriculumClick = () => {
        // Download do PDF local
        const link = document.createElement('a');
        link.href = '/CVFernandoForasteri.pdf';
        link.download = 'Fernando_Forastieri_Curriculo.pdf';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        // Redirecionar para a página do currículo
        window.location.href = '/curriculum';
    }

    return (
        <header className={'container flex justify-between py-4'}>
            <div className={'flex justify-center items-center'}>
                <Link className={'flex justify-center items-center mr-4'} href={'/'}>
                    <Image
                        src={logo}
                        height={28}
                        width={28}
                        alt={'logo'}
                    />
                    <div className={'ml-1 text-lg font-semibold'}>
                        {title}
                    </div>
                </Link>
                <div className={'hidden md:block space-x-1'}>
                    {routes.map((route: any) => (
                        route.name === 'Currículo' ? (
                            <Button 
                                key={route.name}
                                variant={active == route.name ? 'secondary' : 'ghost'} 
                                className={'text-base'}
                                onClick={handleCurriculumClick}
                            >
                                {route.name}
                            </Button>
                        ) : (
                            <Link key={route.name} href={route?.value}>
                                <Button variant={active == route.name ? 'secondary' : 'ghost'} className={'text-base'}>
                                    {route.name}
                                </Button>
                            </Link>
                        )
                    ))}
                </div>
            </div>
            <div className={'flex justify-center items-center space-x-1'}>
                <div className={'md:hidden block'}>
                    <Sheet open={open} onOpenChange={() => {
                        setOpen(!open)
                    }}>
                        <SheetTrigger>
                            <Button size={'icon'} variant={'ghost'}>
                                <Menu size={20}/>
                            </Button>
                        </SheetTrigger>
                        <SheetContent side={'top'} className={'w-full space-y-4 p-12 text-sm'}>
                            {routes.map((route: any, index: number) => (
                                <div key={route.name} className={'space-y-4'}>
                                    {route.name === 'Currículo' ? (
                                        <Button 
                                            variant={active == route.name ? 'secondary' : 'ghost'} 
                                            className={'text-base w-full'}
                                            onClick={() => {
                                                handleCurriculumClick();
                                                setOpen(false);
                                            }}
                                        >
                                            {route.name}
                                        </Button>
                                    ) : (
                                        <Link href={route.value} onClick={() => {
                                            setOpen(false)
                                        }}>
                                            <Button variant={active == route.name ? 'secondary' : 'ghost'} className={'text-base w-full'}>
                                                {route.name}
                                            </Button>
                                        </Link>
                                    )}
                                    {index != routes.length - 1 && <Separator/>}
                                </div>
                            ))}
                        </SheetContent>
                    </Sheet>
                </div>
                <Link href={githubRepo}>
                    <Button size={'icon'} variant={'ghost'}>
                        <Github size={20}/>
                    </Button>
                </Link>
                <Button
                    size={'icon'}
                    variant={'ghost'}
                    onClick={() => {
                        setTheme(theme == 'light' ? 'dark' : 'light')
                    }}
                >
                    {theme == 'light' && <Sun size={20}/>}
                    {theme == 'dark' && <Moon size={20}/>}
                </Button>
            </div>
        </header>
    );
}

export default Header;