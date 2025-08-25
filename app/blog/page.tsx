import siteData from "@/blog.config";
import Title from "@/components/title";
import {Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle} from "@/components/ui/card";
import Time from "@/app/blog/components/time";
import {Badge} from "@/components/ui/badge";
import Link from "next/link";
import {Button} from "@/components/ui/button";
import {ArrowRight, ChevronDown, ChevronRight, Briefcase, Heart} from "lucide-react";
import {Separator} from "@/components/ui/separator";
import path from "path";
import fs from "fs";
import matter from "gray-matter";
import readingTime from "reading-time";

const getPostsData = () => {
    const postsDirectory = path.join(process.cwd(), 'posts')
    const fileNames = fs.readdirSync(postsDirectory)
    return fileNames.map((fileName: any) => {
        const id = fileName.replace(/\.md$/, '')
        const fullPath = path.join(postsDirectory, fileName)
        const fileContents = fs.readFileSync(fullPath, 'utf8')
        const matterResult = matter(fileContents)
        return {
            id,
            ...matterResult.data,
            content: matterResult.content,
            stats: readingTime(matterResult.content)
        }
    })
}

import BlogClient from "./blog-client";

const Blog = () => {
    const {blog: {title, description}} = siteData;
    const posts = getPostsData().filter((post: any) => !post.draft)

    return (
        <>
            <Title title={title} description={description}/>
            <BlogClient posts={posts} />
        </>
    )
}

export default Blog
