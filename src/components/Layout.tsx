import React from 'react';

interface LayoutProps {
    children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
    return (
        <div className="min-h-screen p-4 md:p-8 flex flex-col items-center antialiased selection:bg-emerald-500/30 bg-slate-950 text-slate-200">
            <div className="w-full max-w-3xl space-y-6">
                {children}
            </div>
        </div>
    );
};
