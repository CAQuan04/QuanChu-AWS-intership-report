import { AnimatedPage } from '../components/AnimatedPage';
import { Breadcrumb } from '../components/ui/Breadcrumb';
import { MarkdownRenderer } from '../components/MarkdownRenderer';
import { useLanguage } from '../contexts/LanguageContext';
import { loadContent } from '../utils/contentLoader';

export const ProposalPage = () => {
    const { language } = useLanguage();
    const content = loadContent('proposal', language);

    return (
        <AnimatedPage>
            <div className="page-container">
                <Breadcrumb items={[{ label: language === 'vi' ? 'Đề Xuất' : 'Proposal' }]} />
                <h1 className="page-title">{language === 'vi' ? 'Đề Xuất Dự Án' : 'Project Proposal'}</h1>

                <div className="bg-white rounded-xl p-8 shadow-sm border border-slate-200">
                    <MarkdownRenderer content={content} />
                </div>
            </div>
        </AnimatedPage>
    );
};
