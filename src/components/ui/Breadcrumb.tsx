import { ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

interface BreadcrumbItem {
    label: string;
    path?: string;
}

interface BreadcrumbProps {
    items: BreadcrumbItem[];
}

export const Breadcrumb = ({ items }: BreadcrumbProps) => {
    return (
        <nav className="breadcrumb">
            <Link to="/" className="hover:text-aws-orange transition-colors">Home</Link>
            {items.map((item, index) => (
                <div key={index} className="flex items-center gap-2">
                    <ChevronRight size={14} className="text-slate-400" />
                    {item.path ? (
                        <Link to={item.path} className="hover:text-aws-orange transition-colors font-medium text-slate-600 hover:text-slate-900">
                            {item.label}
                        </Link>
                    ) : (
                        <span className="text-slate-400 font-normal">{item.label}</span>
                    )}
                </div>
            ))}
        </nav>
    );
};
