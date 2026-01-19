import { AnimatedPage } from '../components/AnimatedPage';
import { Breadcrumb } from '../components/ui/Breadcrumb';
import { MarkdownRenderer } from '../components/MarkdownRenderer';
import { useLanguage } from '../contexts/LanguageContext';
import { loadContent } from '../utils/contentLoader';

export const FeedbackPage = () => {
    const { language } = useLanguage();
    const content = loadContent('feedback', language);

    return (
        <AnimatedPage>
            <div className="page-container">
                <Breadcrumb items={[{ label: language === 'vi' ? 'Phản Hồi' : 'Feedback' }]} />
                <h1 className="page-title">{language === 'vi' ? 'Phản Hồi' : 'Feedback & Insights'}</h1>

                <div className="card-static">
                    <MarkdownRenderer content={content} />
                </div>
            </div>
        </AnimatedPage>
    );
};
