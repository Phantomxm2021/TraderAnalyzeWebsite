import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Trash2, Clock, ChevronRight, Search } from 'lucide-react';
import { HistoryService, type HistoryItem } from '../../services/history/HistoryService';

export const HistoryPage: React.FC = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const [history, setHistory] = useState<HistoryItem[]>([]);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        setHistory(HistoryService.getAll());
    }, []);

    const handleDelete = (e: React.MouseEvent, id: string) => {
        e.stopPropagation();
        if (window.confirm(t('history.confirm_delete'))) {
            HistoryService.delete(id);
            setHistory(HistoryService.getAll());
        }
    };

    const handleClearAll = () => {
        if (window.confirm(t('history.confirm_clear_all'))) {
            HistoryService.clear();
            setHistory([]);
        }
    };

    const handleItemClick = (item: HistoryItem) => {
        navigate('/', { state: { historyItem: item } });
    };

    const filteredHistory = history.filter(item =>
        item.request.ticker.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const formatDate = (timestamp: number) => {
        return new Date(timestamp).toLocaleString();
    };

    return (
        <div className="animate-fade-in space-y-6">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => navigate('/')}
                        className="p-2 rounded-full hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
                    >
                        <ArrowLeft className="w-5 h-5" />
                    </button>
                    <h2 className="text-xl font-bold text-white">{t('history.title')}</h2>
                </div>
                {history.length > 0 && (
                    <button
                        onClick={handleClearAll}
                        className="text-xs text-rose-400 hover:text-rose-300 flex items-center gap-1"
                    >
                        <Trash2 className="w-3 h-3" />
                        {t('history.clear_all')}
                    </button>
                )}
            </div>

            <div className="glass-panel rounded-xl p-6 border-l-4 border-l-indigo-500 shadow-2xl shadow-black/50 min-h-[60vh]">
                <div className="mb-6 relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder={t('history.search_placeholder')}
                        className="w-full bg-slate-900/50 border border-slate-700 rounded-lg pl-10 pr-4 py-2 text-sm text-white focus:outline-none focus:border-indigo-500 transition-colors"
                    />
                </div>

                {filteredHistory.length === 0 ? (
                    <div className="text-center py-12 text-slate-500">
                        <Clock className="w-12 h-12 mx-auto mb-3 opacity-20" />
                        <p>{searchTerm ? t('history.no_results') : t('history.empty')}</p>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {filteredHistory.map((item) => (
                            <div
                                key={item.id}
                                onClick={() => handleItemClick(item)}
                                className="group flex items-center justify-between p-4 rounded-lg bg-slate-800/30 border border-slate-700/50 hover:bg-slate-800/50 hover:border-indigo-500/30 transition-all cursor-pointer"
                            >
                                <div className="flex items-center gap-4">
                                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center font-bold text-sm ${item.result.verdict.direction === 'Long' ? 'bg-emerald-500/20 text-emerald-400' :
                                        item.result.verdict.direction === 'Short' ? 'bg-rose-500/20 text-rose-400' :
                                            'bg-slate-500/20 text-slate-400'
                                        }`}>
                                        {item.request.ticker}
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <span className="text-white font-medium">{item.result.verdict.strategyType}</span>
                                            <span className="text-xs text-slate-500">•</span>
                                            <span className="text-xs text-slate-400">{formatDate(item.timestamp)}</span>
                                        </div>
                                        <div className="text-xs text-slate-500 mt-0.5">
                                            Score: {item.result.macroScore + item.result.techScore}/20
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3">
                                    <button
                                        onClick={(e) => handleDelete(e, item.id)}
                                        className="p-2 rounded-full hover:bg-rose-500/20 text-slate-600 hover:text-rose-400 transition-colors opacity-0 group-hover:opacity-100"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                    <ChevronRight className="w-4 h-4 text-slate-600 group-hover:text-indigo-400 transition-colors" />
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};
