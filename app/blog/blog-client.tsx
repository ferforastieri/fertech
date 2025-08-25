"use client";

import {Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle} from "@/components/ui/card";
import Time from "@/app/blog/components/time";
import {Badge} from "@/components/ui/badge";
import Link from "next/link";
import {Button} from "@/components/ui/button";
import {ArrowRight, ChevronDown, ChevronRight, Briefcase, Heart} from "lucide-react";
import {Separator} from "@/components/ui/separator";
import { useState } from "react";

interface BlogClientProps {
    posts: any[];
}

const BlogClient = ({ posts }: BlogClientProps) => {
    // Filtrar posts por categoria
    const workPosts = posts.filter((post: any) => post.category === 'work')
    const personalPosts = posts.filter((post: any) => post.category === 'personal')

    const [expandedSections, setExpandedSections] = useState({
        work: true,
        personal: true
    });

    const toggleSection = (section: 'work' | 'personal') => {
        setExpandedSections(prev => ({
            ...prev,
            [section]: !prev[section]
        }));
    };

    const renderPostCard = (post: any, index: number, totalPosts: number) => (
        <div key={post.id}>
            <Card className={'col-span-1 border-none shadow-none hover:shadow-md transition-shadow duration-200'}>
                <CardHeader className={'pl-0'}>
                    <div className={'flex items-center space-x-4'}>
                        <Time date={post.date}/>
                        <div className={'hidden md:block ml-4 space-x-1'}>
                            {post.tags.map((tag: string, index: number) => (
                                <Badge key={index} variant={'secondary'}>
                                    {tag}
                                </Badge>
                            ))}
                        </div>
                    </div>
                    <CardTitle className="text-xl font-bold hover:text-blue-600 transition-colors">
                        {post.title}
                    </CardTitle>
                    <CardDescription className={'block md:hidden space-x-1'}>
                        {post.tags.map((tag: string, index: number) => (
                            <Badge key={index} variant={'secondary'}>
                                {tag}
                            </Badge>
                        ))}
                    </CardDescription>
                </CardHeader>
                <CardContent className={'pl-0'}>
                    <p className="text-gray-600 leading-relaxed">
                        {post.summary}
                    </p>
                </CardContent>
                <CardFooter className={'flex justify-start pl-0'}>
                    <Link href={`/blog/${post.id}`}>
                        <Button className="bg-blue-600 hover:bg-blue-700 transition-colors">
                            Leia mais <ArrowRight size={16} className={'ml-2'}/>
                        </Button>
                    </Link>
                </CardFooter>
            </Card>
            {index !== totalPosts - 1 && <Separator className="my-6"/>}
        </div>
    )

    return (
        <>
            {/* Seção de Artigos de Trabalho */}
            <div className="mb-8">
                <button 
                    onClick={() => toggleSection('work')}
                    className="w-full flex items-center justify-between p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
                >
                    <div className="flex items-center space-x-3">
                        <div className="p-2 bg-blue-200 rounded-full">
                            <Briefcase className="h-5 w-5 text-blue-700" />
                        </div>
                        <div className="text-left">
                            <h2 className="text-xl font-bold text-gray-900">Artigos de Trabalho</h2>
                            <p className="text-sm text-gray-600">{workPosts.length} artigos</p>
                        </div>
                    </div>
                    {expandedSections.work ? (
                        <ChevronDown className="h-5 w-5 text-gray-500" />
                    ) : (
                        <ChevronRight className="h-5 w-5 text-gray-500" />
                    )}
                </button>
                
                {expandedSections.work && (
                    <div className="mt-4 space-y-4">
                        {workPosts.length > 0 ? (
                            workPosts.map((post: any, index: number) => 
                                renderPostCard(post, index, workPosts.length)
                            )
                        ) : (
                            <div className="text-center py-8 bg-gray-50 rounded-lg">
                                <p className="text-gray-500">Nenhum artigo de trabalho publicado ainda.</p>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Seção de Artigos Pessoais */}
            <div className="mb-8">
                <button 
                    onClick={() => toggleSection('personal')}
                    className="w-full flex items-center justify-between p-4 bg-pink-50 rounded-lg hover:bg-pink-100 transition-colors"
                >
                    <div className="flex items-center space-x-3">
                        <div className="p-2 bg-pink-200 rounded-full">
                            <Heart className="h-5 w-5 text-pink-700" />
                        </div>
                        <div className="text-left">
                            <h2 className="text-xl font-bold text-gray-900">Artigos Pessoais</h2>
                            <p className="text-sm text-gray-600">{personalPosts.length} artigos</p>
                        </div>
                    </div>
                    {expandedSections.personal ? (
                        <ChevronDown className="h-5 w-5 text-gray-500" />
                    ) : (
                        <ChevronRight className="h-5 w-5 text-gray-500" />
                    )}
                </button>
                
                {expandedSections.personal && (
                    <div className="mt-4 space-y-4">
                        {personalPosts.length > 0 ? (
                            personalPosts.map((post: any, index: number) => 
                                renderPostCard(post, index, personalPosts.length)
                            )
                        ) : (
                            <div className="text-center py-8 bg-gray-50 rounded-lg">
                                <p className="text-gray-500">Nenhum artigo pessoal publicado ainda.</p>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </>
    )
}

export default BlogClient
