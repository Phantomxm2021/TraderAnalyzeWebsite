import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Play } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { AnalysisRequest } from '../../services/llm/types';

interface AnalysisFormProps {
    onSubmit: (data: AnalysisRequest) => void;
    isLoading: boolean;
}

export const AnalysisForm: React.FC<AnalysisFormProps> = ({ onSubmit, isLoading }) => {
    const { t, i18n } = useTranslation();

    const cacheKey = 'analysis_form_cache';

    const [formData, setFormData] = useState({
        analysisType: 'options' as 'options' | 'underlying',
        ticker: '',
        price: '',
        ivRank: '',
        hvRank: '',
        support: '',
        resistance: '',
        rsi: '',
        macd: '',
        apiKey: localStorage.getItem('llm_api_key') || '',
        provider: (localStorage.getItem('llm_provider') as 'openai' | 'gemini' | 'doubao') || 'openai',
        model: localStorage.getItem('llm_model') || '',
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        setTimeout(() => {
            const next = { ...formData, [name]: value };
            localStorage.setItem(cacheKey, JSON.stringify(next));
        }, 0);
    };

    React.useEffect(() => {
        const cached = localStorage.getItem(cacheKey);
        if (cached) {
            try {
                const obj = JSON.parse(cached);
                // Ensure we use the latest settings from localStorage, not the stale cache
                const currentSettings = {
                    apiKey: localStorage.getItem('llm_api_key') || '',
                    provider: (localStorage.getItem('llm_provider') as 'openai' | 'gemini' | 'doubao') || 'openai',
                    model: localStorage.getItem('llm_model') || '',
                };

                setFormData(prev => ({
                    ...prev,
                    ...obj,
                    ...currentSettings // Overwrite cache with current settings
                }));
            } catch { }
        }
    }, []);

    const handleSaveCache = () => {
        localStorage.setItem(cacheKey, JSON.stringify(formData));
    };

    const handleClearCache = () => {
        localStorage.removeItem(cacheKey);
        setFormData({
            analysisType: 'options',
            ticker: '',
            price: '',
            ivRank: '',
            hvRank: '',
            support: '',
            resistance: '',
            rsi: '',
            macd: '',
            apiKey: localStorage.getItem('llm_api_key') || '',
            provider: (localStorage.getItem('llm_provider') as 'openai' | 'gemini' | 'doubao') || 'openai',
            model: localStorage.getItem('llm_model') || '',
        });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit({
            ...formData,
            language: i18n.language === 'zh' ? 'Chinese' : 'English'
        });
    };

    return (
        <div className="glass-panel rounded-xl p-6 border-l-4 border-l-emerald-500 shadow-2xl shadow-black/50 animate-fade-in">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                    <div className="relative flex h-3 w-3">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
                    </div>
                    {t('ingestion.title')}
                </h2>
                <div className="flex items-center gap-4">
                    <span className="text-xs font-mono text-slate-500">{t('ingestion.phase')}</span>
                    <button
                        type="button"
                        onClick={handleSaveCache}
                        className="text-xs px-3 py-1 rounded-lg bg-slate-800/50 hover:bg-slate-800 border border-slate-700 text-slate-300"
                    >
                        {t('ingestion.cache')}
                    </button>
                    <button
                        type="button"
                        onClick={handleClearCache}
                        className="text-xs px-3 py-1 rounded-lg bg-rose-600/20 hover:bg-rose-600/30 border border-rose-600/30 text-rose-400"
                    >
                        {t('ingestion.reset_input')}
                    </button>
                </div>
            </div>

            <form onSubmit={handleSubmit}>
                {/* Analysis Type Selector */}
                <div className="mb-6">
                    <label className="block text-xs font-medium text-slate-400 uppercase tracking-wider mb-3">
                        {t('ingestion.analysis_type')}
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                        <button
                            type="button"
                            onClick={() => setFormData(prev => ({ ...prev, analysisType: 'options' }))}
                            className={`py-3 px-4 rounded-lg font-medium transition-all ${formData.analysisType === 'options'
                                ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-500/30'
                                : 'bg-slate-800/50 text-slate-400 hover:bg-slate-800 border border-slate-700'
                                }`}
                        >
                            {t('ingestion.analysis_type_options')}
                        </button>
                        <button
                            type="button"
                            onClick={() => setFormData(prev => ({ ...prev, analysisType: 'underlying' }))}
                            className={`py-3 px-4 rounded-lg font-medium transition-all ${formData.analysisType === 'underlying'
                                ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-500/30'
                                : 'bg-slate-800/50 text-slate-400 hover:bg-slate-800 border border-slate-700'
                                }`}
                        >
                            {t('ingestion.analysis_type_underlying')}
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-6">
                    <div className="space-y-4">
                        <div>
                            <label className="block text-xs font-medium text-slate-400 uppercase tracking-wider mb-1.5">
                                {t('ingestion.ticker')}
                            </label>
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    name="ticker"
                                    value={formData.ticker}
                                    onChange={handleChange}
                                    className="input-field uppercase flex-1"
                                    placeholder={t('ingestion.ticker_placeholder')}
                                    required
                                />

                            </div>

                        </div>
                        <div>
                            <label className="block text-xs font-medium text-slate-400 uppercase tracking-wider mb-1.5">
                                {t('ingestion.price')}
                            </label>
                            <input
                                type="text"
                                name="price"
                                value={formData.price}
                                onChange={handleChange}
                                className="input-field"
                                placeholder={t('ingestion.price_placeholder')}
                                required
                            />
                        </div>
                    </div>

                    {/* Conditional IV Fields - Only for Options Analysis */}
                    {formData.analysisType === 'options' && (
                        <div className="space-y-4">
                            <div>
                                <label className="block text-xs font-medium text-slate-400 uppercase tracking-wider mb-1.5">
                                    {t('ingestion.iv_rank')}
                                </label>
                                <input
                                    type="text"
                                    name="ivRank"
                                    value={formData.ivRank}
                                    onChange={handleChange}
                                    className="input-field"
                                    placeholder={t('ingestion.iv_rank_placeholder')}
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-slate-400 uppercase tracking-wider mb-1.5">
                                    {t('ingestion.hv_rank')}
                                </label>
                                <input
                                    type="text"
                                    name="hvRank"
                                    value={formData.hvRank}
                                    onChange={handleChange}
                                    className="input-field"
                                    placeholder={t('ingestion.hv_rank_placeholder')}
                                    required
                                />
                            </div>
                        </div>
                    )}

                    <div className="space-y-4">
                        <div>
                            <label className="block text-xs font-medium text-slate-400 uppercase tracking-wider mb-1.5">
                                {t('ingestion.support')}
                            </label>
                            <input
                                type="text"
                                name="support"
                                value={formData.support}
                                onChange={handleChange}
                                className="input-field"
                                placeholder={t('ingestion.support_placeholder')}
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-slate-400 uppercase tracking-wider mb-1.5">
                                {t('ingestion.resistance')}
                            </label>
                            <input
                                type="text"
                                name="resistance"
                                value={formData.resistance}
                                onChange={handleChange}
                                className="input-field"
                                placeholder={t('ingestion.resistance_placeholder')}
                            />
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div>
                            <label className="block text-xs font-medium text-slate-400 uppercase tracking-wider mb-1.5">
                                {t('ingestion.rsi')}
                            </label>
                            <input
                                type="text"
                                name="rsi"
                                value={formData.rsi}
                                onChange={handleChange}
                                className="input-field"
                                placeholder={t('ingestion.rsi_placeholder')}
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-slate-400 uppercase tracking-wider mb-1.5">
                                {t('ingestion.macd')}
                            </label>
                            <input
                                type="text"
                                name="macd"
                                value={formData.macd}
                                onChange={handleChange}
                                className="input-field"
                                placeholder={t('ingestion.macd_placeholder')}
                            />
                        </div>
                    </div>
                </div>

                <button
                    type="submit"
                    disabled={isLoading || !formData.apiKey}
                    className="w-full bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-700 disabled:cursor-not-allowed text-white font-medium py-3 rounded-lg transition-all flex items-center justify-center gap-2 group"
                >
                    {isLoading ? (
                        <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                    ) : (
                        <>
                            <span>{t('ingestion.run_analysis')}</span>
                            <Play className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </>
                    )}
                </button>
                {!formData.apiKey && (
                    <p className="text-center text-xs text-rose-400 mt-2">
                        Please enter your API Key in <Link to="/settings" className="underline hover:text-rose-300">settings</Link> to proceed.
                    </p>
                )}
            </form>
        </div>
    );
};
