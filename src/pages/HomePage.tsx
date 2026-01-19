import { AnimatedPage } from '../components/AnimatedPage';
import { useLanguage } from '../contexts/LanguageContext';
import { loadContent } from '../utils/contentLoader';
import { MarkdownRenderer } from '../components/MarkdownRenderer';
import { navigationStructure } from '../data/navigationStructure';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { useState, useEffect } from 'react';

export const HomePage = () => {
    const { language } = useLanguage();
    const [content, setContent] = useState('');

    useEffect(() => {
        const raw = loadContent('home', language);
        // We might need to split the content if we want to render profile separately
        // For now, let's render it all via markdown
        setContent(raw);
    }, [language]);

    return (
        <AnimatedPage>
            <div className="page-container">
                {/* Profile Section (rendered from Markdown for flexibility) */}
                {/* Profile Section */}
                <div className="mb-12">
                    <div className="flex flex-col md:flex-row items-center md:items-start gap-8 mb-10">
                        {/* Profile Image - Larger & Rectangular/Rounded */}
                        <div className="relative group shrink-0">
                            <div className="absolute inset-0 bg-gradient-to-br from-aws-orange to-yellow-400 rounded-2xl blur opacity-30 group-hover:opacity-50 transition-opacity duration-500"></div>
                            <img
                                src="/QuanChu-AWS-intership-report/images/profile.jpg"
                                alt="Quan Chu"
                                className="relative w-64 h-auto md:w-72 lg:w-80 rounded-2xl shadow-2xl object-cover border-4 border-white transition-transform duration-500 group-hover:scale-[1.02]"
                            />
                        </div>

                        {/* Text Content */}
                        <div className="flex-1 text-center md:text-left pt-4">
                            <h1 className="text-4xl md:text-5xl font-extrabold text-aws-navy mb-4 tracking-tight">
                                {language === 'vi' ? 'Báo Cáo Thực Tập' : 'Internship Report'}
                            </h1>
                            <p className="text-2xl text-aws-orange font-light mb-6">
                                First Cloud Journey Internship Program
                            </p>

                            <div className="card-static bg-gradient-to-br from-white to-slate-50 border-white/50 shadow-sm p-6 mb-6">
                                <MarkdownRenderer content={content} />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Navigation Cards Grid */}
                <div>
                    <h2 className="section-title">{language === 'vi' ? 'Cấu Trúc Báo Cáo' : 'Report Structure'}</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {navigationStructure.slice(1).map((item, index) => (
                            <Link key={item.path} to={item.path} className="group">
                                <div className="card h-full flex flex-col hover:border-aws-orange/50">
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="w-12 h-12 rounded-lg bg-slate-50 flex items-center justify-center text-aws-navy group-hover:bg-aws-orange group-hover:text-white transition-colors duration-300">
                                            <item.icon size={24} />
                                        </div>
                                        <span className="text-4xl font-bold text-slate-100 group-hover:text-amber-50 transition-colors">
                                            {index + 1}
                                        </span>
                                    </div>
                                    <h3 className="text-lg font-bold text-slate-800 mb-2 group-hover:text-aws-orange transition-colors">
                                        {language === 'vi' ? item.labelVi : item.labelEn}
                                    </h3>
                                    <p className="text-sm text-slate-500 mb-4 flex-1">
                                        {language === 'vi' ? 'Xem chi tiết báo cáo và nhật ký công việc.' : 'View detailed report and worklogs.'}
                                    </p>
                                    <div className="flex items-center text-sm font-medium text-aws-orange gap-1 group-hover:translate-x-1 transition-transform">
                                        {language === 'vi' ? 'Chi tiết' : 'View Details'} <ChevronRight size={16} />
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
        </AnimatedPage>
    );
};
