import { AnimatedPage } from '../components/AnimatedPage';
import { Breadcrumb } from '../components/ui/Breadcrumb';
import { MarkdownRenderer } from '../components/MarkdownRenderer';
import { useLanguage } from '../contexts/LanguageContext';
import { loadContent } from '../utils/contentLoader';
import { Link } from 'react-router-dom';
import { BookOpen } from 'lucide-react';

const blogs = Array.from({ length: 3 }, (_, i) => i + 1);

export const BlogsPage = () => {
    const { language } = useLanguage();
    const content = loadContent('blogs/index', language);

    return (
        <AnimatedPage>
            <div className="page-container">
                <Breadcrumb items={[{ label: language === 'vi' ? 'Blogs' : 'Blogs' }]} />

                <h1 className="page-title">{language === 'vi' ? 'Blogs Đã Dịch' : 'Translated Blogs'}</h1>
                <div className="mb-12">
                    <MarkdownRenderer content={content || ""} />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {blogs.map((blog) => (
                        <Link key={blog} to={`/blogs/blog-${blog}`} className="group">
                            <div className="card h-full hover:border-aws-orange/30">
                                <div className="flex items-center gap-4 mb-4">
                                    <div className="week-badge bg-blue-100 text-blue-800">B{blog}</div>
                                    <div>
                                        <h3 className="font-bold text-slate-800 group-hover:text-aws-orange transition-colors">
                                            {language === 'vi' ? `Blog ${blog}` : `Blog ${blog}`}
                                        </h3>
                                        <div className="flex items-center gap-1 text-xs text-slate-400">
                                            <BookOpen size={12} />
                                            <span>Read Article</span>
                                        </div>
                                    </div>
                                </div>
                                <p className="text-sm text-slate-500 line-clamp-2">
                                    Click to read translated AWS blog {blog}.
                                </p>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </AnimatedPage>
    );
};

const BlogArticlePage = ({ blog }: { blog: number }) => {
    const { language } = useLanguage();
    const content = loadContent(`blogs/blog-${blog}`, language);

    return (
        <AnimatedPage>
            <div className="page-container">
                <Breadcrumb
                    items={[
                        { label: language === 'vi' ? 'Blogs' : 'Blogs', path: '/blogs' },
                        { label: language === 'vi' ? `Blog ${blog}` : `Blog ${blog}` }
                    ]}
                />

                <div className="flex items-center gap-4 mb-8">
                    <div className="week-badge bg-blue-100 text-blue-800 text-xl">B{blog}</div>
                    <h1 className="page-title mb-0">{language === 'vi' ? `Bài Dịch ${blog}` : `Translated Blog ${blog}`}</h1>
                </div>

                <div className="bg-white rounded-xl p-8 border border-slate-200">
                    <MarkdownRenderer content={content || ""} />
                </div>
            </div>
        </AnimatedPage>
    );
}

export const Blog1Page = () => <BlogArticlePage blog={1} />;
export const Blog2Page = () => <BlogArticlePage blog={2} />;
export const Blog3Page = () => <BlogArticlePage blog={3} />;
