import React from 'react';
import { Terminal, Settings, History } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

export const Header: React.FC = () => {
    const { t } = useTranslation();

    return (
        <header className="w-full mb-8 flex items-center justify-between border-b border-slate-800 pb-4">
            <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-emerald-500/10 rounded-lg flex items-center justify-center border border-emerald-500/20">
                    <Terminal className="text-emerald-500 w-6 h-6" />
                </div>
                <div>
                    <h1 className="text-xl font-bold tracking-tight text-white">{t('app.title')}</h1>
                    <p className="text-xs text-slate-500 font-mono">{t('app.subtitle')}</p>
                </div>
            </div>
            <div className="flex items-center gap-4">
                <Link to="/history" className="p-2 rounded-full hover:bg-slate-800 text-slate-400 hover:text-white transition-colors" title={t('history.title')}>
                    <History className="w-5 h-5" />
                </Link>
                <Link to="/settings" className="p-2 rounded-full hover:bg-slate-800 text-slate-400 hover:text-white transition-colors" title={t('settings.title')}>
                    <Settings className="w-5 h-5" />
                </Link>
                <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse-slow"></span>
                {t('app.system_online')}
            </div>
        </header >
    );
};


