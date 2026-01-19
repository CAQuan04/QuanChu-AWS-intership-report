import { ReactNode } from 'react';
import { Sidebar } from './Sidebar';
import { Menu } from 'lucide-react';
import { useState } from 'react';

interface LayoutProps {
    children: ReactNode;
}

export const Layout = ({ children }: LayoutProps) => {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    return (
        <div className="min-h-screen bg-content-surface">
            {/* Mobile Header */}
            <div className="lg:hidden fixed top-0 left-0 w-full bg-aws-navy text-white z-50 px-4 py-3 flex items-center justify-between shadow-md">
                <span className="font-bold">AWS Internship Report</span>
                <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="p-2">
                    <Menu size={24} />
                </button>
            </div>

            {/* Sidebar Wrapper for Mobile */}
            <div className={`
        fixed inset-0 z-40 transform transition-transform duration-300 lg:transform-none lg:static
        ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
                {/* Mobile Overlay */}
                <div
                    className={`fixed inset-0 bg-black/50 lg:hidden ${mobileMenuOpen ? 'block' : 'hidden'}`}
                    onClick={() => setMobileMenuOpen(false)}
                />
                <Sidebar />
            </div>

            {/* Main Content */}
            <main className="main-content pt-14 lg:pt-0">
                <div className="min-h-screen">
                    {children}
                </div>
            </main>
        </div>
    );
};
