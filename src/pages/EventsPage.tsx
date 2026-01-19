import { AnimatedPage } from '../components/AnimatedPage';
import { Breadcrumb } from '../components/ui/Breadcrumb';
import { MarkdownRenderer } from '../components/MarkdownRenderer';
import { useLanguage } from '../contexts/LanguageContext';
import { loadEvents } from '../utils/eventLoader';
import { Calendar, MapPin, User, ChevronDown, ChevronUp } from 'lucide-react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export const EventsPage = () => {
    const { language } = useLanguage();
    const events = loadEvents(language);

    return (
        <AnimatedPage>
            <div className="page-container">
                <Breadcrumb items={[{ label: language === 'vi' ? 'Sự Kiện' : 'Events' }]} />
                <h1 className="page-title">{language === 'vi' ? 'Sự Kiện Tham Gia' : 'Events Participated'}</h1>

                <div className="space-y-8 mt-8">
                    {events.map((event) => (
                        <EventCard key={event.id} event={event} />
                    ))}
                </div>
            </div>
        </AnimatedPage>
    );
};

const EventCard = ({ event }: { event: any }) => {
    const [isExpanded, setIsExpanded] = useState(false);

    return (
        <div className="card border-l-4 border-l-aws-orange p-0 overflow-hidden">
            <div className="p-6 cursor-pointer" onClick={() => setIsExpanded(!isExpanded)}>
                <div className="flex justify-between items-start">
                    <h2 className="text-xl font-bold text-slate-800">{event.title}</h2>
                    <button className="text-slate-400 hover:text-aws-orange">
                        {isExpanded ? <ChevronUp /> : <ChevronDown />}
                    </button>
                </div>

                <div className="flex flex-wrap gap-4 mt-3 text-sm text-slate-600">
                    <div className="flex items-center gap-2 bg-slate-100 px-3 py-1 rounded-full">
                        <Calendar size={14} className="text-aws-orange" />
                        <span>{event.date}</span>
                    </div>
                    <div className="flex items-center gap-2 bg-slate-100 px-3 py-1 rounded-full">
                        <MapPin size={14} className="text-blue-500" />
                        <span>{event.location}</span>
                    </div>
                    <div className="flex items-center gap-2 bg-slate-100 px-3 py-1 rounded-full">
                        <User size={14} className="text-purple-500" />
                        <span>{event.role}</span>
                    </div>
                </div>
            </div>

            <AnimatePresence>
                {isExpanded && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="bg-slate-50 border-t border-slate-100"
                    >
                        <div className="p-6">
                            <MarkdownRenderer content={event.content} />

                            {event.takeaways && event.takeaways.length > 0 && (
                                <div className="mt-6 bg-amber-50 rounded-xl p-5 border border-amber-100">
                                    <h3 className="font-bold text-amber-800 mb-3 flex items-center gap-2">
                                        Takeaways
                                    </h3>
                                    <ul className="space-y-2">
                                        {event.takeaways.map((item: string, idx: number) => (
                                            <li key={idx} className="flex items-start gap-2 text-sm text-slate-700">
                                                <span className="text-amber-500 mt-1">•</span>
                                                {item}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};
