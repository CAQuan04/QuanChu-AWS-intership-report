import { AnimatedPage } from '../components/AnimatedPage';
import { Breadcrumb } from '../components/ui/Breadcrumb';
import { MarkdownRenderer } from '../components/MarkdownRenderer';
import { useLanguage } from '../contexts/LanguageContext';
import { loadContent } from '../utils/contentLoader';
import { Link } from 'react-router-dom';
import { Calendar } from 'lucide-react';

const weeks = Array.from({ length: 12 }, (_, i) => i + 1);

export const WorklogPage = () => {
    const { language } = useLanguage();
    const content = loadContent('worklog/index', language);

    return (
        <AnimatedPage>
            <div className="page-container">
                <Breadcrumb items={[{ label: language === 'vi' ? 'Nhật Ký' : 'Worklog' }]} />

                <h1 className="page-title">{language === 'vi' ? 'Nhật Ký Công Việc' : 'Worklog'}</h1>
                <div className="mb-12">
                    <MarkdownRenderer content={content} />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {weeks.map((week) => (
                        <Link key={week} to={`/worklog/week-${week}`} className="group">
                            <div className="card h-full hover:border-aws-orange/30">
                                <div className="flex items-center gap-4 mb-4">
                                    <div className="week-badge">W{week}</div>
                                    <div>
                                        <h3 className="font-bold text-slate-800 group-hover:text-aws-orange transition-colors">
                                            {language === 'vi' ? `Tuần ${week}` : `Week ${week}`}
                                        </h3>
                                        <div className="flex items-center gap-1 text-xs text-slate-400">
                                            <Calendar size={12} />
                                            <span>Aug {11 + week} - Aug {17 + week}</span>
                                        </div>
                                    </div>
                                </div>
                                <p className="text-sm text-slate-500 line-clamp-2">
                                    Click to view detailed tasks and activities for week {week}.
                                </p>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </AnimatedPage>
    );
};

const WeekPage = ({ week }: { week: number }) => {
    const { language } = useLanguage();
    const content = loadContent(`worklog/week-${week}`, language);

    return (
        <AnimatedPage>
            <div className="page-container">
                <Breadcrumb
                    items={[
                        { label: language === 'vi' ? 'Nhật Ký' : 'Worklog', path: '/worklog' },
                        { label: language === 'vi' ? `Tuần ${week}` : `Week ${week}` }
                    ]}
                />

                <div className="flex items-center gap-4 mb-8">
                    <div className="week-badge text-xl">W{week}</div>
                    <h1 className="page-title mb-0">{language === 'vi' ? `Báo Cáo Tuần ${week}` : `Week ${week} Report`}</h1>
                </div>

                <div className="bg-white rounded-xl p-8 border border-slate-200">
                    <MarkdownRenderer content={content} />
                </div>
            </div>
        </AnimatedPage>
    );
}

export const Week1Page = () => <WeekPage week={1} />;
export const Week2Page = () => <WeekPage week={2} />;
export const Week3Page = () => <WeekPage week={3} />;
export const Week4Page = () => <WeekPage week={4} />;
export const Week5Page = () => <WeekPage week={5} />;
export const Week6Page = () => <WeekPage week={6} />;
export const Week7Page = () => <WeekPage week={7} />;
export const Week8Page = () => <WeekPage week={8} />;
export const Week9Page = () => <WeekPage week={9} />;
export const Week10Page = () => <WeekPage week={10} />;
export const Week11Page = () => <WeekPage week={11} />;
export const Week12Page = () => <WeekPage week={12} />;
