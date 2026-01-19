interface SectionHeaderProps {
    title: string;
    description?: string;
    className?: string;
}

export const SectionHeader = ({ title, description, className = '' }: SectionHeaderProps) => {
    return (
        <div className={`mb-8 ${className}`}>
            <h2 className="section-title">{title}</h2>
            {description && (
                <p className="text-slate-500 text-lg max-w-3xl">{description}</p>
            )}
        </div>
    );
};
