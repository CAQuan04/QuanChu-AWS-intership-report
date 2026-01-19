import { AnimatedPage } from '../components/AnimatedPage';
import { Breadcrumb } from '../components/ui/Breadcrumb';
import { MarkdownRenderer } from '../components/MarkdownRenderer';
import { useLanguage } from '../contexts/LanguageContext';
import { loadContent } from '../utils/contentLoader';

export const EvaluationPage = () => {
    const { language } = useLanguage();
    const content = loadContent('evaluation', language);

    return (
        <AnimatedPage>
            <div className="page-container">
                <Breadcrumb items={[{ label: language === 'vi' ? 'Đánh Giá' : 'Self-evaluation' }]} />
                <h1 className="page-title">{language === 'vi' ? 'Tự Đánh Giá' : 'Self Assessment'}</h1>

                <div className="card-static">
                    <MarkdownRenderer content={content} />
                </div>
            </div>
        </AnimatedPage>
    );
};
