import type { AnalysisRequest, AnalysisResult } from '../llm/types';

export interface HistoryItem {
    id: string;
    timestamp: number;
    request: AnalysisRequest;
    result: AnalysisResult;
}

const STORAGE_KEY = 'analysis_history';

export const HistoryService = {
    save: (request: AnalysisRequest, result: AnalysisResult): HistoryItem => {
        const history = HistoryService.getAll();
        const newItem: HistoryItem = {
            id: crypto.randomUUID(),
            timestamp: Date.now(),
            request,
            result
        };

        // Add to beginning of array
        history.unshift(newItem);

        // Limit to 50 items to prevent storage bloat
        if (history.length > 50) {
            history.pop();
        }

        localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
        return newItem;
    },

    getAll: (): HistoryItem[] => {
        try {
            const stored = localStorage.getItem(STORAGE_KEY);
            return stored ? JSON.parse(stored) : [];
        } catch (error) {
            console.error('Failed to load history:', error);
            return [];
        }
    },

    getById: (id: string): HistoryItem | undefined => {
        const history = HistoryService.getAll();
        return history.find(item => item.id === id);
    },

    delete: (id: string): void => {
        const history = HistoryService.getAll();
        const filtered = history.filter(item => item.id !== id);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
    },

    clear: (): void => {
        localStorage.removeItem(STORAGE_KEY);
    }
};
