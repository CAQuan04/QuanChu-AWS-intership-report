import { AnimatedPage } from '../components/AnimatedPage';
import { Breadcrumb } from '../components/ui/Breadcrumb';
import { MarkdownRenderer } from '../components/MarkdownRenderer';
import { useLanguage } from '../contexts/LanguageContext';
import { loadContent } from '../utils/contentLoader';
import { Link } from 'react-router-dom';
import { Wrench, Settings, Play, Trash2 } from 'lucide-react';

const workshopSections = [
    { id: 'overview', icon: Wrench, labelEn: 'Overview', labelVi: 'Tổng Quan' },
    { id: 'setup', icon: Settings, labelEn: 'Setup', labelVi: 'Cài Đặt' },
    { id: 'implementation', icon: Play, labelEn: 'Implementation', labelVi: 'Triển Khai' },
    { id: 'cleanup', icon: Trash2, labelEn: 'Clean Up', labelVi: 'Dọn Dẹp' },
];

export const WorkshopPage = () => {
    return <WorkshopOverviewPage />;
};

const WorkshopLayout = ({ sectionId, content }: { sectionId: string, content: string }) => {
    const { language } = useLanguage();

    return (
        <AnimatedPage>
            <div className="page-container">
                <Breadcrumb items={[
                    { label: 'Workshop', path: '/workshop' },
                    { label: workshopSections.find(s => s.id === sectionId)?.[language === 'vi' ? 'labelVi' : 'labelEn'] || sectionId }
                ]} />

                <h1 className="page-title">{language === 'vi' ? 'Workshop Thực Hành' : 'Workshop Implementation'}</h1>

                {/* Workshop Navigation Tabs */}
                <div className="flex flex-wrap gap-2 mb-8 border-b border-slate-200 pb-1">
                    {workshopSections.map((section) => (
                        <Link
                            key={section.id}
                            to={`/workshop/${section.id}`}
                            className={`
                                flex items-center gap-2 px-6 py-3 rounded-t-lg text-sm font-medium transition-all
                                ${sectionId === section.id
                                    ? 'bg-aws-navy text-white border-b-4 border-aws-orange translate-y-[1px]'
                                    : 'bg-slate-50 text-slate-500 hover:bg-slate-100 hover:text-slate-700'
                                }
                            `}
                        >
                            <section.icon size={16} />
                            <span>{language === 'vi' ? section.labelVi : section.labelEn}</span>
                        </Link>
                    ))}
                </div>

                <div className="bg-white rounded-b-xl p-8 border border-slate-200 min-h-[500px]">
                    <MarkdownRenderer content={content} />
                </div>
            </div>
        </AnimatedPage>
    );
};

export const WorkshopOverviewPage = () => {
    const { language } = useLanguage();
    const content = loadContent('workshop/overview', language);
    return <WorkshopLayout sectionId="overview" content={content} />;
};

export const WorkshopSetupPage = () => {
    const { language } = useLanguage();
    const content = loadContent('workshop/setup', language);
    return <WorkshopLayout sectionId="setup" content={content} />;
};

export const WorkshopImplementationPage = () => {
    const { language } = useLanguage();
    const content = loadContent('workshop/implementation', language);
    return <WorkshopLayout sectionId="implementation" content={content} />;
};

export const WorkshopCleanupPage = () => {
    const { language } = useLanguage();
    const content = loadContent('workshop/cleanup', language);
    return <WorkshopLayout sectionId="cleanup" content={content} />;
};
