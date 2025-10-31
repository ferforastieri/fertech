import {Separator} from "@/components/ui/separator";

interface TitleProps {
    title: string;
    description?: string;
}

export default function Title({title, description}: TitleProps) {
    return (
        <div className={'pb-6'}>
            <h1>{title}</h1>
            {description && <p className={'text-zinc-600 dark:text-zinc-400'}>{description}</p>}
            <Separator className="mt-4"/>
        </div>
    );
}

