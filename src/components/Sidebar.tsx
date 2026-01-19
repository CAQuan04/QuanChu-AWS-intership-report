import { NavLink, useLocation } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { navigationStructure } from '../data/navigationStructure';
import { ChevronRight, Globe } from 'lucide-react';

export const Sidebar = () => {
    const { language, setLanguage } = useLanguage();
    const location = useLocation();

    const isActive = (path: string) => {
        if (path === '/' && location.pathname !== '/') return false;
        return location.pathname.startsWith(path);
    };

    return (
        <aside className="sidebar flex flex-col">
            {/* Header */}
            <div className="p-6 border-b border-white/10">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
                        <img
                            src="https://upload.wikimedia.org/wikipedia/commons/9/93/Amazon_Web_Services_Logo.svg"
                            alt="AWS"
                            className="w-6 h-6 object-contain"
                        />
                    </div>
                    <div>
                        <h1 className="font-bold text-lg leading-tight text-white">Internship Report</h1>
                        <p className="text-xs text-aws-orange font-medium">AWS Vietnam</p>
                    </div>
                </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 overflow-y-auto py-6 space-y-1">
                {navigationStructure.map((item) => (
                    <div key={item.path}>
                        <NavLink
                            to={item.path}
                            className={({ isActive: linkActive }) =>
                                `sidebar-link flex items-center gap-3 ${linkActive ? 'active' : ''}`
                            }
                            end={item.path === '/'}
                        >
                            <item.icon size={18} />
                            <span>{language === 'vi' ? item.labelVi : item.labelEn}</span>
                        </NavLink>

                        {/* Submenu for Worklog & Workshop if active or child active */}
                        {item.children && isActive(item.path) && (
                            <div className="bg-black/20 py-1 mb-1">
                                {item.children.map((child) => (
                                    <NavLink
                                        key={child.path}
                                        to={child.path}
                                        className={({ isActive }) =>
                                            `block pl-12 pr-6 py-2 text-sm transition-colors ${isActive ? 'text-aws-orange font-medium' : 'text-slate-400 hover:text-slate-200'
                                            }`
                                        }
                                    >
                                        <div className="flex items-center gap-2">
                                            {isActive(child.path) && <ChevronRight size={12} className="text-aws-orange" />}
                                            <span>{language === 'vi' ? child.labelVi : child.labelEn}</span>
                                        </div>
                                    </NavLink>
                                ))}
                            </div>
                        )}
                    </div>
                ))}
            </nav>

            {/* Footer / Language Toggle */}
            <div className="p-6 border-t border-white/10 bg-black/20">
                <div className="flex items-center justify-between">
                    <div className="text-xs text-slate-400">
                        <p>Quan Chu</p>
                        <p>FCJ Cloud Intern</p>
                    </div>

                    <button
                        onClick={() => setLanguage(language === 'en' ? 'vi' : 'en')}
                        className="lang-toggle"
                    >
                        <Globe size={14} />
                        <span>{language === 'en' ? 'EN' : 'VI'}</span>
                    </button>
                </div>
            </div>
        </aside>
    );
};
