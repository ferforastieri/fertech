interface TitleProps {
    title: string;
    description?: string;
}

export default function Title({title, description}: TitleProps) {
    return (
        <div className={'pb-3'}>
            <h1 className="text-lg font-bold leading-tight">{title}</h1>
            {description && <p className={'text-zinc-600 dark:text-zinc-400 mt-2'}>{description}</p>}
        </div>
    );
}
